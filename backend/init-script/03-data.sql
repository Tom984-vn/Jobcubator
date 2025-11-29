-- ==================================================================
-- Dữ liệu mẫu cho bảng jobpost
-- ==================================================================

INSERT INTO jobpost (
    company_id, title, category, description_path, location, number_of_vacancies, job_type, application_deadline, min_salary, max_salary
) VALUES 
-- ==================================================================
-- 1. KHỐI KỸ THUẬT & SẢN XUẤT
-- ==================================================================
(gen_random_uuid(), 'Quản lý sản xuất', 'Sản xuất', '/jobs/vn/quan_ly_sx.md', 'Bình Dương', 1, 'Toàn thời gian', '2025-12-20', 35000000, 55000000),
(gen_random_uuid(), 'Kỹ sư bảo trì cơ điện cao cấp', 'Bảo trì', '/jobs/vn/ks_bao_tri_senior.md', 'Bắc Ninh', 2, 'Toàn thời gian', '2025-11-30', 25000000, 40000000),
(gen_random_uuid(), 'Trưởng phòng kiểm soát chất lượng (QA/QC)', 'Chất lượng', '/jobs/vn/tp_qaqc.md', 'Hưng Yên', 1, 'Toàn thời gian', '2025-12-15', 30000000, 50000000),
(gen_random_uuid(), 'Quản đốc phân xưởng đúc', 'Sản xuất', '/jobs/vn/quan_doc_duc.md', 'Hải Phòng', 1, 'Toàn thời gian', '2025-12-10', 28000000, 45000000),
(gen_random_uuid(), 'Chuyên gia cải tiến quy trình (Lean Expert)', 'Cải tiến', '/jobs/vn/chuyen_gia_lean.md', 'Đồng Nai', 1, 'Toàn thời gian', '2026-01-05', 40000000, 70000000),
(gen_random_uuid(), 'Trưởng nhóm kế hoạch vật tư', 'Kế hoạch', '/jobs/vn/tn_ke_hoach.md', 'Vĩnh Phúc', 1, 'Toàn thời gian', '2025-12-25', 25000000, 40000000),
(gen_random_uuid(), 'Kỹ sư tự động hóa dây chuyền', 'Kỹ thuật', '/jobs/vn/ks_tu_dong_hoa.md', 'Hà Nam', 2, 'Toàn thời gian', '2025-12-05', 22000000, 38000000),
(gen_random_uuid(), 'Trưởng ca sản xuất', 'Sản xuất', '/jobs/vn/truong_ca.md', 'Bình Dương', 3, 'Toàn thời gian', '2025-11-28', 18000000, 28000000),
(gen_random_uuid(), 'Quản lý an toàn lao động nhà máy', 'An toàn', '/jobs/vn/quan_ly_hse.md', 'Thái Nguyên', 1, 'Toàn thời gian', '2025-12-30', 30000000, 50000000),
(gen_random_uuid(), 'Chuyên viên nghiên cứu công thức sản phẩm', 'R&D', '/jobs/vn/cv_rnd.md', 'Long An', 2, 'Toàn thời gian', '2026-01-15', 20000000, 35000000),
(gen_random_uuid(), 'Tổ trưởng tổ lắp ráp điện tử', 'Sản xuất', '/jobs/vn/to_truong_lap_rap.md', 'Bắc Giang', 5, 'Toàn thời gian', '2025-11-20', 15000000, 25000000),
(gen_random_uuid(), 'Trưởng bộ phận kho vận nhà máy', 'Kho vận', '/jobs/vn/tbp_kho.md', 'Hải Dương', 1, 'Toàn thời gian', '2025-12-12', 25000000, 40000000),

-- ==================================================================
-- 2. KHỐI XÂY DỰNG & BẤT ĐỘNG SẢN
-- ==================================================================
(gen_random_uuid(), 'Chỉ huy trưởng công trình', 'Thi công', '/jobs/vn/cht.md', 'Hà Nội', 2, 'Toàn thời gian', '2025-12-31', 45000000, 75000000),
(gen_random_uuid(), 'Quản lý dự án xây dựng', 'Quản lý dự án', '/jobs/vn/ql_du_an.md', 'TP. Hồ Chí Minh', 1, 'Toàn thời gian', '2026-01-20', 40000000, 65000000),
(gen_random_uuid(), 'Trưởng nhóm kinh tế xây dựng (QS)', 'Kinh tế xây dựng', '/jobs/vn/tn_qs.md', 'Đà Nẵng', 1, 'Toàn thời gian', '2025-12-15', 30000000, 50000000),
(gen_random_uuid(), 'Kiến trúc sư chủ trì', 'Thiết kế', '/jobs/vn/kts_chu_tri.md', 'Hà Nội', 1, 'Toàn thời gian', '2025-12-25', 35000000, 60000000),
(gen_random_uuid(), 'Kỹ sư giám sát kết cấu', 'Giám sát', '/jobs/vn/ks_gs_ket_cau.md', 'Quảng Ninh', 3, 'Toàn thời gian', '2025-11-30', 20000000, 35000000),
(gen_random_uuid(), 'Trưởng phòng phát triển quỹ đất', 'Đầu tư', '/jobs/vn/tp_pt_quy_dat.md', 'Hưng Yên', 1, 'Toàn thời gian', '2026-02-15', 40000000, 70000000),
(gen_random_uuid(), 'Quản lý vận hành tòa nhà chung cư', 'Vận hành', '/jobs/vn/ql_vh_toa_nha.md', 'TP. Hồ Chí Minh', 1, 'Toàn thời gian', '2025-12-05', 30000000, 50000000),
(gen_random_uuid(), 'Kỹ sư cơ điện (MEP) chủ trì', 'Cơ điện', '/jobs/vn/ks_mep_chu_tri.md', 'Bình Dương', 1, 'Toàn thời gian', '2025-12-20', 35000000, 55000000),
(gen_random_uuid(), 'Chuyên viên pháp lý dự án', 'Pháp lý', '/jobs/vn/cv_phap_ly.md', 'Hà Nội', 2, 'Toàn thời gian', '2025-12-10', 25000000, 45000000),
(gen_random_uuid(), 'Trưởng nhóm bán hàng bất động sản', 'Kinh doanh', '/jobs/vn/tn_ban_hang_bds.md', 'Nha Trang', 4, 'Toàn thời gian', '2025-11-25', 20000000, 50000000),
(gen_random_uuid(), 'Chỉ huy phó công trình', 'Thi công', '/jobs/vn/chp.md', 'Thanh Hóa', 2, 'Toàn thời gian', '2025-12-18', 30000000, 50000000),
(gen_random_uuid(), 'Trưởng bộ phận an toàn công trường', 'An toàn', '/jobs/vn/tbp_hse_site.md', 'Vũng Tàu', 1, 'Toàn thời gian', '2025-12-12', 25000000, 45000000),

-- ==================================================================
-- 3. KHỐI TÀI CHÍNH - NGÂN HÀNG
-- ==================================================================
(gen_random_uuid(), 'Trưởng phòng giao dịch', 'Ngân hàng', '/jobs/vn/tp_giao_dich.md', 'Cần Thơ', 1, 'Toàn thời gian', '2025-12-30', 35000000, 60000000),
(gen_random_uuid(), 'Kế toán trưởng công ty con', 'Kế toán', '/jobs/vn/ktt_cty_con.md', 'Hà Nội', 1, 'Toàn thời gian', '2025-12-28', 30000000, 50000000),
(gen_random_uuid(), 'Kiểm soát viên nội bộ', 'Kiểm soát', '/jobs/vn/ksv_noi_bo.md', 'TP. Hồ Chí Minh', 2, 'Toàn thời gian', '2026-01-10', 25000000, 45000000),
(gen_random_uuid(), 'Trưởng nhóm thẩm định tín dụng doanh nghiệp', 'Thẩm định', '/jobs/vn/tn_td_dn.md', 'Đà Nẵng', 1, 'Toàn thời gian', '2025-12-15', 30000000, 55000000),
(gen_random_uuid(), 'Chuyên viên phân tích tài chính cao cấp', 'Tài chính', '/jobs/vn/cv_pt_tc.md', 'Bình Dương', 1, 'Toàn thời gian', '2025-12-20', 25000000, 40000000),
(gen_random_uuid(), 'Quản lý quan hệ khách hàng doanh nghiệp lớn', 'Kinh doanh', '/jobs/vn/rm_dn_lon.md', 'Hải Phòng', 2, 'Toàn thời gian', '2025-11-30', 30000000, 55000000),
(gen_random_uuid(), 'Trưởng nhóm thu hồi nợ', 'Ngân hàng', '/jobs/vn/tn_thu_hoi_no.md', 'Đồng Nai', 1, 'Toàn thời gian', '2025-12-05', 25000000, 45000000),
(gen_random_uuid(), 'Kế toán thuế tổng hợp', 'Kế toán', '/jobs/vn/kt_thue.md', 'Hưng Yên', 2, 'Toàn thời gian', '2025-12-10', 18000000, 30000000),
(gen_random_uuid(), 'Chuyên viên tư vấn đầu tư chứng khoán', 'Đầu tư', '/jobs/vn/cv_tv_dau_tu.md', 'Hà Nội', 5, 'Toàn thời gian', '2025-12-25', 20000000, 50000000),
(gen_random_uuid(), 'Trưởng bộ phận hành chính nhân sự', 'Hành chính', '/jobs/vn/tbp_hcns.md', 'Long An', 1, 'Toàn thời gian', '2025-11-25', 25000000, 40000000),
(gen_random_uuid(), 'Chuyên viên quản trị rủi ro', 'Rủi ro', '/jobs/vn/cv_qtrr.md', 'TP. Hồ Chí Minh', 1, 'Toàn thời gian', '2026-01-05', 30000000, 55000000),
(gen_random_uuid(), 'Kiểm toán viên độc lập', 'Kiểm toán', '/jobs/vn/ktv_doc_lap.md', 'Hà Nội', 2, 'Toàn thời gian', '2025-12-18', 25000000, 45000000),

-- ==================================================================
-- 4. LOGISTICS & CHUỖI CUNG ỨNG
-- ==================================================================
(gen_random_uuid(), 'Quản lý kho trung tâm', 'Kho vận', '/jobs/vn/ql_kho_tt.md', 'Bắc Ninh', 1, 'Toàn thời gian', '2025-12-30', 30000000, 50000000),
(gen_random_uuid(), 'Trưởng phòng mua hàng', 'Mua hàng', '/jobs/vn/tp_mua_hang.md', 'Bình Dương', 1, 'Toàn thời gian', '2026-01-15', 35000000, 60000000),
(gen_random_uuid(), 'Trưởng nhóm điều phối vận tải', 'Vận tải', '/jobs/vn/tn_dieu_phoi.md', 'TP. Hồ Chí Minh', 1, 'Toàn thời gian', '2025-12-10', 22000000, 35000000),
(gen_random_uuid(), 'Chuyên viên xuất nhập khẩu tổng hợp', 'Xuất nhập khẩu', '/jobs/vn/cv_xnk.md', 'Hải Phòng', 2, 'Toàn thời gian', '2025-11-28', 18000000, 30000000),
(gen_random_uuid(), 'Quản lý đội xe', 'Vận tải', '/jobs/vn/ql_doi_xe.md', 'Đà Nẵng', 1, 'Toàn thời gian', '2025-12-20', 25000000, 40000000),
(gen_random_uuid(), 'Chuyên viên hoạch định nguồn hàng', 'Kế hoạch', '/jobs/vn/cv_hoach_dinh.md', 'Hà Nội', 1, 'Toàn thời gian', '2025-12-12', 20000000, 35000000),
(gen_random_uuid(), 'Trưởng bộ phận thủ tục hải quan', 'Logistics', '/jobs/vn/tbp_hai_quan.md', 'Bà Rịa - Vũng Tàu', 1, 'Toàn thời gian', '2025-12-05', 28000000, 45000000),
(gen_random_uuid(), 'Giám sát kho hàng', 'Kho vận', '/jobs/vn/gs_kho.md', 'Hưng Yên', 2, 'Toàn thời gian', '2025-11-25', 15000000, 25000000),
(gen_random_uuid(), 'Chuyên viên mua hàng quốc tế', 'Mua hàng', '/jobs/vn/cv_mua_hang_qt.md', 'Đồng Nai', 1, 'Toàn thời gian', '2026-01-20', 22000000, 38000000),
(gen_random_uuid(), 'Trưởng trạm trung chuyển', 'Logistics', '/jobs/vn/truong_tram.md', 'Nghệ An', 1, 'Toàn thời gian', '2025-12-15', 20000000, 35000000),

-- ==================================================================
-- 5. DỊCH VỤ & Y TẾ
-- ==================================================================
(gen_random_uuid(), 'Quản lý nhà hàng', 'Dịch vụ', '/jobs/vn/ql_nha_hang.md', 'Hà Nội', 1, 'Toàn thời gian', '2025-12-20', 25000000, 45000000),
(gen_random_uuid(), 'Điều dưỡng trưởng khoa', 'Y tế', '/jobs/vn/dieu_duong_truong.md', 'TP. Hồ Chí Minh', 1, 'Toàn thời gian', '2025-12-15', 22000000, 35000000),
(gen_random_uuid(), 'Trưởng bộ phận lễ tân', 'Khách sạn', '/jobs/vn/tbp_le_tan.md', 'Phú Quốc', 1, 'Toàn thời gian', '2025-11-30', 20000000, 35000000),
(gen_random_uuid(), 'Bếp trưởng nhà hàng Á', 'Ẩm thực', '/jobs/vn/bep_truong.md', 'Đà Nẵng', 1, 'Toàn thời gian', '2025-12-25', 30000000, 50000000),
(gen_random_uuid(), 'Quản lý phòng khám đa khoa', 'Y tế', '/jobs/vn/ql_phong_kham.md', 'Bình Dương', 1, 'Toàn thời gian', '2026-01-10', 30000000, 50000000),
(gen_random_uuid(), 'Bác sĩ nội tổng quát', 'Y tế', '/jobs/vn/bac_si_noi.md', 'Hải Phòng', 2, 'Toàn thời gian', '2025-12-05', 35000000, 60000000),
(gen_random_uuid(), 'Trưởng phòng kinh doanh khách sạn', 'Kinh doanh', '/jobs/vn/tp_kd_ks.md', 'Nha Trang', 1, 'Toàn thời gian', '2026-01-15', 30000000, 55000000),
(gen_random_uuid(), 'Dược sĩ quản lý nhà thuốc', 'Y tế', '/jobs/vn/duoc_si_ql.md', 'Cần Thơ', 1, 'Toàn thời gian', '2025-12-10', 18000000, 30000000),
(gen_random_uuid(), 'Quản lý spa và trị liệu', 'Dịch vụ', '/jobs/vn/ql_spa.md', 'Hội An', 1, 'Toàn thời gian', '2025-12-18', 25000000, 40000000),
(gen_random_uuid(), 'Trưởng bộ phận buồng phòng', 'Khách sạn', '/jobs/vn/tbp_buong_phong.md', 'Vũng Tàu', 1, 'Toàn thời gian', '2025-11-25', 18000000, 30000000),
(gen_random_uuid(), 'Kỹ thuật viên xét nghiệm trưởng', 'Y tế', '/jobs/vn/ktv_xet_nghiem.md', 'Hà Nội', 1, 'Toàn thời gian', '2025-12-22', 20000000, 35000000),
(gen_random_uuid(), 'Chuyên viên đào tạo nội bộ', 'Nhân sự', '/jobs/vn/cv_dao_tao.md', 'TP. Hồ Chí Minh', 1, 'Toàn thời gian', '2025-12-12', 20000000, 35000000);
