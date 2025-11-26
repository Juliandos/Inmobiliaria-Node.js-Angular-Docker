@echo off
echo ========================================
echo   Deteniendo contenedores Docker
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose stop"

echo.
echo ========================================
echo   Verificando estado...
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"

echo.
echo ========================================
echo   Contenedores detenidos correctamente
echo ========================================
echo.
pause

