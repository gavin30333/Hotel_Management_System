
import time
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    print("Step 1: Login as super_admin")
    try:
        page.goto("http://localhost:8000/login")
        page.wait_for_load_state("networkidle")
        print(f"Page title: {page.title()}")
        
        # Take screenshot for debugging
        page.screenshot(path="debug_login.png")
        
        # Print all buttons text
        buttons = page.locator("button").all()
        print(f"Found {len(buttons)} buttons:")
        for btn in buttons:
            print(f"Button text: '{btn.inner_text()}'")

        # Fill login form
        page.fill("input#username", "admin") # trying ID selector based on standard antd
        page.fill("input#password", "admin123")
        
        # Try a more specific selector for the button
        # Based on index.tsx, it's inside a Form.Item inside a Form inside a Card
        # It has type="submit" and class containing "loginButton"
        page.click("button[type='submit']")
        
        # Wait for navigation
        page.wait_for_url("**/hotel/list", timeout=10000)
        print("Logged in successfully as super_admin")

        # Check for Admin Management link
        print("Step 2: Check Admin Management link")
        # Ensure sidebar is loaded
        page.wait_for_selector(".ant-layout-sider")
        
        admin_link = page.locator("a[href='/admin/management']")
        if admin_link.is_visible():
            print("Admin Management link is visible")
            admin_link.click()
        else:
            print("Admin Management link is NOT visible - FAILED")
            print("Sidebar links:")
            links = page.locator(".ant-menu-item a").all()
            for link in links:
                print(f"Link: {link.get_attribute('href')} - {link.inner_text()}")
            browser.close()
            return

        page.wait_for_url("**/admin/management")
        print("Navigated to Admin Management page")
        
        # Create new admin
        print("Step 3: Create new admin 'testadmin'")
        
        page.click("button:has-text('创建管理员')")
        page.wait_for_selector(".ant-modal-content")
        
        # Fill create form
        page.fill("input#username", "testadmin") 
        page.fill("input#password", "password123")
        
        # Submit - use specific selector for modal OK button
        page.click(".ant-modal-footer .ant-btn-primary")
        
        # Wait for modal to close and table to update
        page.wait_for_selector(".ant-modal-content", state="hidden")
        time.sleep(2) # Wait for table refresh
        
        # Verify testadmin in table
        # We look for a row that contains the username
        row = page.locator("tr", has_text="testadmin")
        if row.count() > 0:
            print("testadmin found in table")
        else:
            print("testadmin NOT found in table - FAILED")
            browser.close()
            return
        
        # Step 4: Suspend admin
        print("Step 4: Suspend testadmin")
        
        # Get the row again
        row = page.locator("tr", has_text="testadmin")
        status_tag = row.locator(".ant-tag").nth(1) # Assuming 2nd tag is status (1st is role)
        print(f"Current status: {status_tag.inner_text()}")
        
        # Find suspend button in this row
        suspend_btn = row.locator("button", has_text="挂起")
        if suspend_btn.is_visible():
            suspend_btn.click()
            # Confirm popconfirm
            page.wait_for_selector(".ant-popconfirm")
            page.click(".ant-popconfirm-buttons .ant-btn-primary")
            print("Clicked suspend and confirmed")
            time.sleep(2)
            
            # Verify status
            row = page.locator("tr", has_text="testadmin")
            # Re-locate status tag
            status_tag = row.locator(".ant-tag").nth(1)
            if "已挂起" in status_tag.inner_text() or "red" in status_tag.get_attribute("class"):
                print("Status updated to Suspended")
            else:
                print(f"Status NOT updated - Current: {status_tag.inner_text()} - FAILED")
        else:
            print("Suspend button not found (maybe already suspended?)")

        # Step 5: Logout
        print("Step 5: Logout")
        page.hover(".ant-avatar") # Hover to show dropdown
        page.wait_for_selector(".ant-dropdown-menu")
        page.click("li:has-text('退出登录')")
        page.wait_for_url("**/login")
        print("Logged out")

        # Step 6: Try to login as suspended admin
        print("Step 6: Login as suspended admin")
        page.fill("input#username", "testadmin")
        page.fill("input#password", "password123")
        page.click("button[type='submit']")
        
        # Check for error message
        try:
            error_alert = page.locator(".ant-alert-error")
            error_alert.wait_for(state="visible", timeout=5000)
            error_text = error_alert.inner_text()
            print(f"Error message: {error_text}")
            if "禁用" in error_text or "suspended" in error_text:
                print("Login blocked correctly")
            else:
                print("Unexpected error message")
        except:
            print("No error message found - Login might have succeeded (FAILED)")
            if "hotel/list" in page.url:
                print("Logged in successfully - FAILED (Should be suspended)")

        # Step 7: Activate admin
        print("Step 7: Reactivate admin")
        # Login as super admin again
        page.fill("input#username", "admin")
        page.fill("input#password", "admin123")
        page.click("button[type='submit']")
        page.wait_for_url("**/hotel/list")
        
        page.goto("http://localhost:8000/admin/management")
        page.wait_for_load_state("networkidle")
        
        row = page.locator("tr", has_text="testadmin")
        activate_btn = row.locator("button", has_text="激活")
        if activate_btn.is_visible():
            activate_btn.click()
            page.wait_for_selector(".ant-popconfirm")
            page.click(".ant-popconfirm-buttons .ant-btn-primary")
            print("Clicked activate and confirmed")
            time.sleep(2)
            
            # Verify status
            row = page.locator("tr", has_text="testadmin")
            status_tag = row.locator(".ant-tag").nth(1)
            if "正常" in status_tag.inner_text() or "green" in status_tag.get_attribute("class"):
                print("Status updated to Active")
            else:
                print(f"Status NOT updated - Current: {status_tag.inner_text()} - FAILED")
        
        # Step 8: Verify login works
        print("Step 8: Verify login works for activated admin")
        page.hover(".ant-avatar")
        page.click("li:has-text('退出登录')")
        
        page.fill("input#username", "testadmin")
        page.fill("input#password", "password123")
        page.click("button[type='submit']")
        
        try:
            page.wait_for_url("**/hotel/list", timeout=5000)
            print("Logged in successfully as testadmin")
            
            # Verify NO admin management link
            # Reload page to be sure
            page.reload()
            page.wait_for_load_state("networkidle")
            
            admin_link = page.locator("a[href='/admin/management']")
            if not admin_link.is_visible():
                print("Admin Management link is correctly HIDDEN for regular admin")
            else:
                print("Admin Management link is VISIBLE for regular admin - FAILED")
                
        except:
            print("Login failed for activated admin - FAILED")
            
    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error_state.png")
    
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
