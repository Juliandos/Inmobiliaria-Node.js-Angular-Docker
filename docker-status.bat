@echo off
echo ========================================
echo   Estado de contenedores Docker
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"

echo.
pause

