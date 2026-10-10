#!/usr/bin/env bash
echo "==================================================="
echo " HE THONG QUAN LY DINH DUONG & BEP AN MAM NON"
echo "==================================================="
echo ""
if [ ! -d "node_modules" ]; then
    echo "Cài đặt thư viện lần đầu tiên (npm install)..."
    npm install
fi

echo ""
echo "Đang khởi động ứng dụng tại địa chỉ: http://localhost:3000"
echo "Nhấn Ctrl + C để dừng ứng dụng."
echo ""
npm run dev
