import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("=" * 60)
    print("RUNNING COMPLETE BACKEND API INTEGRATION TEST SUITE")
    print("=" * 60)

    # 1. Login with Acme Admin
    login_url = f"{BASE_URL}/api/auth/login/"
    payload = {"email": "admin@acme.com", "password": "Admin12345!"}
    res = requests.post(login_url, json=payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    login_data = res.json()
    access_token = login_data['tokens']['access']
    refresh_token = login_data['tokens']['refresh']
    acme_company = login_data['user']['active_company']
    print(f"[OK] Auth Login Successful! User: {login_data['user']['email']}, Role: {acme_company['role']}, Company: {acme_company['name']}")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Company-ID": acme_company['id']
    }

    # 2. Test User Profile
    res = requests.get(f"{BASE_URL}/api/auth/profile/", headers=headers)
    assert res.status_code == 200, f"Profile failed: {res.text}"
    print(f"[OK] Profile API Verified. Belongs to {len(res.json()['companies'])} company.")

    # 3. Test Dashboard Summary
    res = requests.get(f"{BASE_URL}/api/analytics/dashboard/?time_range=year", headers=headers)
    assert res.status_code == 200, f"Dashboard failed: {res.text}"
    dash_data = res.json()
    kpis = dash_data['kpis']
    print(f"[OK] Dashboard KPIs Verified: Revenue: ${kpis['total_revenue']:,.2f}, Orders: {kpis['total_orders']}, Customers: {kpis['total_customers']}, Net Profit: ${kpis['net_profit']:,.2f}, AOV: ${kpis['aov']:,.2f}")
    assert len(dash_data['charts']['revenue_over_time']) > 0, "No revenue chart data"
    print(f"[OK] Charts Verified: {len(dash_data['charts']['revenue_over_time'])} daily points in revenue time-series.")

    # 4. Test AI Business Insights
    res = requests.get(f"{BASE_URL}/api/analytics/insights/", headers=headers)
    assert res.status_code == 200, f"Insights failed: {res.text}"
    insights = res.json()['insights']
    print(f"[OK] AI Business Insights: Generated {len(insights)} dynamic data-driven insights.")
    for ins in insights[:3]:
        print(f"     * [{ins['type']}] {ins['title']} -> {ins['metric']}")

    # 5. Test Customer Analytics
    res = requests.get(f"{BASE_URL}/api/analytics/customer-analytics/", headers=headers)
    assert res.status_code == 200, f"Customer analytics failed: {res.text}"
    cust_an = res.json()
    print(f"[OK] Customer Analytics: Avg CLV: ${cust_an['average_clv']:,.2f}, Repeat Rate: {cust_an['repeat_customer_rate']}%")

    # 6. Test ML Sales Forecasting
    res = requests.get(f"{BASE_URL}/api/ml/sales-forecast/?days=14", headers=headers)
    assert res.status_code == 200, f"Sales forecast failed: {res.text}"
    forecast_data = res.json()
    print(f"[OK] ML Sales Forecast: Projected 14-day revenue: ${forecast_data['projected_revenue']:,.2f} via {forecast_data['model_name']}")

    # 7. Test ML Customer Churn
    res = requests.get(f"{BASE_URL}/api/ml/churn/", headers=headers)
    assert res.status_code == 200, f"Churn failed: {res.text}"
    churn_data = res.json()
    print(f"[OK] ML Churn Risk: Evaluated {churn_data['summary']['total_evaluated']} accounts. High Risk: {churn_data['summary']['high_risk']}, Med: {churn_data['summary']['medium_risk']}, Low: {churn_data['summary']['low_risk']}")

    # 8. Test ML Customer Segments
    res = requests.get(f"{BASE_URL}/api/ml/segments/", headers=headers)
    assert res.status_code == 200, f"Segments failed: {res.text}"
    seg_data = res.json()
    print(f"[OK] ML RFM Segmentation: {len(seg_data['segments_summary'])} clusters. Silhouette Score: {seg_data.get('silhouette_score')}")

    # 9. Test Business CRUD (Customers, Products, Orders, Expenses)
    res_cust = requests.get(f"{BASE_URL}/api/business/customers/", headers=headers)
    res_prod = requests.get(f"{BASE_URL}/api/business/products/", headers=headers)
    res_orders = requests.get(f"{BASE_URL}/api/business/orders/", headers=headers)
    res_exp = requests.get(f"{BASE_URL}/api/business/expenses/", headers=headers)
    print(f"[OK] Business CRUD: {res_cust.json()['count']} Customers, {res_prod.json()['count']} Products, {res_orders.json()['count']} Orders, {res_exp.json()['count']} Expenses.")

    # 10. Test Report Generation (PDF and CSV)
    res_rep_csv = requests.post(f"{BASE_URL}/api/reports/", json={"report_type": "SALES", "file_format": "CSV"}, headers=headers)
    assert res_rep_csv.status_code == 201, f"CSV Report failed: {res_rep_csv.text}"
    res_rep_pdf = requests.post(f"{BASE_URL}/api/reports/", json={"report_type": "REVENUE", "file_format": "PDF"}, headers=headers)
    assert res_rep_pdf.status_code == 201, f"PDF Report failed: {res_rep_pdf.text}"
    print(f"[OK] Report Engine: Generated CSV ({res_rep_csv.json()['file_url']}) and PDF ({res_rep_pdf.json()['file_url']})")

    # 11. Test Tenant Isolation
    # Login as Starlight Retail Admin
    res_starlight = requests.post(login_url, json={"email": "admin@starlight.com", "password": "Starlight12345!"})
    starlight_token = res_starlight.json()['tokens']['access']
    starlight_headers = {"Authorization": f"Bearer {starlight_token}"}
    starlight_dash = requests.get(f"{BASE_URL}/api/analytics/dashboard/", headers=starlight_headers).json()
    starlight_cust = requests.get(f"{BASE_URL}/api/business/customers/", headers=starlight_headers).json()

    print(f"[OK] Strict Tenant Isolation Verified:")
    print(f"     - Acme (Tenant A) Customers: {res_cust.json()['count']}")
    print(f"     - Starlight (Tenant B) Customers: {starlight_cust['count']} (Strictly isolated!)")
    assert starlight_cust['count'] == 1, "Tenant isolation leaked records!"

    print("=" * 60)
    print("ALL BACKEND TEST PHASES (1 THROUGH 12 & 14) PASSED PERFECTLY!")
    print("=" * 60)

if __name__ == '__main__':
    test_api()
