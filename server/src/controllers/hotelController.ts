import { Request, Response } from 'express';
import { Hotel, IHotel } from '../models/Hotel';
import { AuthRequest } from '../middlewares/auth';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';

export const getHotels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      status,
      starRating,
      keyword,
    } = req.query;

    const query: any = {};

    // 权限隔离：商户只能看到自己创建的酒店
    if (req.user?.role !== 'admin') {
      query.creator = req.user?._id;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (starRating && starRating !== 'all') {
      query.starRating = Number(starRating);
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { nameEn: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(pageSize);
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .populate('creator', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(pageSize));

    sendPaginated(res, hotels, total, Number(page), Number(pageSize));
  } catch (error: any) {
    sendError(res, 500, error.message || '获取酒店列表失败');
  }
};

export const getHotelById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('creator', 'username');

    if (!hotel) {
      sendError(res, 404, '酒店不存在');
      return;
    }

    // 权限检查：商户只能查看自己创建的酒店
    if (req.user?.role !== 'admin' && hotel.creator._id.toString() !== req.user?._id?.toString()) {
      sendError(res, 403, '没有权限查看此酒店');
      return;
    }

    sendSuccess(res, hotel);
  } catch (error: any) {
    sendError(res, 500, error.message || '获取酒店详情失败');
  }
};

export const createHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotelData = {
      ...req.body,
      creator: req.user?._id,
      status: 'draft',
    };

    const hotel = await Hotel.create(hotelData);
    sendSuccess(res, hotel, '酒店创建成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '创建酒店失败');
  }
};

export const updateHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      sendError(res, 404, '酒店不存在');
      return;
    }

    // 权限检查：商户只能修改自己创建的酒店
    if (req.user?.role !== 'admin' && hotel.creator.toString() !== req.user?._id?.toString()) {
      sendError(res, 403, '没有权限修改此酒店');
      return;
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    sendSuccess(res, updatedHotel, '酒店更新成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '更新酒店失败');
  }
};

export const deleteHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      sendError(res, 404, '酒店不存在');
      return;
    }

    // 权限检查：商户只能删除自己创建的酒店
    if (req.user?.role !== 'admin' && hotel.creator.toString() !== req.user?._id?.toString()) {
      sendError(res, 403, '没有权限删除此酒店');
      return;
    }

    await Hotel.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, '酒店删除成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '删除酒店失败');
  }
};

export const submitForAudit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      sendError(res, 404, '酒店不存在');
      return;
    }

    // 权限检查：商户只能提交自己创建的酒店
    if (req.user?.role !== 'admin' && hotel.creator.toString() !== req.user?._id?.toString()) {
      sendError(res, 403, '没有权限提交此酒店');
      return;
    }

    if (hotel.status !== 'draft' && hotel.status !== 'offline') {
      sendError(res, 400, '只有草稿或已下线的酒店可以提交审核');
      return;
    }

    hotel.status = 'pending';
    hotel.auditStatus = undefined;
    hotel.auditReason = undefined;
    await hotel.save();

    sendSuccess(res, hotel, '已提交审核');
  } catch (error: any) {
    sendError(res, 500, error.message || '提交审核失败');
  }
};

export const auditHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { passed, reason } = req.body;
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      sendError(res, 404, '酒店不存在');
      return;
    }

    if (hotel.status !== 'pending') {
      sendError(res, 400, '只有待审核的酒店可以进行审核');
      return;
    }

    if (passed) {
      hotel.status = 'online';
      hotel.auditStatus = 'passed';
      hotel.auditReason = undefined;
    } else {
      hotel.status = 'offline';
      hotel.auditStatus = 'rejected';
      hotel.auditReason = reason;
    }

    await hotel.save();
    sendSuccess(res, hotel, passed ? '审核通过，酒店已上线' : '审核已驳回');
  } catch (error: any) {
    sendError(res, 500, error.message || '审核失败');
  }
};

export const toggleOnline = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      sendError(res, 404, '酒店不存在');
      return;
    }

    // 权限检查：商户只能操作自己创建的酒店
    if (req.user?.role !== 'admin' && hotel.creator.toString() !== req.user?._id?.toString()) {
      sendError(res, 403, '没有权限操作此酒店');
      return;
    }

    if (hotel.status === 'online') {
      hotel.status = 'offline';
    } else if (hotel.status === 'offline' && hotel.auditStatus === 'passed') {
      hotel.status = 'online';
    } else {
      sendError(res, 400, '当前状态无法执行此操作');
      return;
    }

    await hotel.save();
    sendSuccess(res, hotel, hotel.status === 'online' ? '酒店已上线' : '酒店已下线');
  } catch (error: any) {
    sendError(res, 500, error.message || '操作失败');
  }
};

export const getHotelStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const matchStage: any = {};
    
    // 权限隔离：商户只能看到自己酒店的统计
    if (req.user?.role !== 'admin') {
      matchStage.creator = req.user?._id;
    }

    const stats = await Hotel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      draft: 0,
      pending: 0,
      online: 0,
      offline: 0,
    };

    stats.forEach((item) => {
      result.total += item.count;
      result[item._id as keyof typeof result] = item.count;
    });

    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, 500, error.message || '获取统计数据失败');
  }
};
