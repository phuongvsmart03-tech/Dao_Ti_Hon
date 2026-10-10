@echo off
chcp 65001 > nul
echo ===================================================
echo  HE THONG QUAN LY DINH DUONG & BEP AN MAM NON
echo ===================================================
echo.
echo Dang kiem tra thu vien...
if not exist node_modules (
    echo Cai dat thu vien lan dau tien (npm install)...
    call npm install
)

echo.
echo Dang khoi dong ung dung tai dia chi: http://localhost:3000
echo Nhan Ctrl + C de dung ung dung.
echo.
call npm run dev
pause
