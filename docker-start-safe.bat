@echo off
echo ========================================
echo   Iniciando contenedores Docker (Puerto 3306)
echo ========================================
echo.

echo [1/3] Verificando y liberando puerto 3306...
wsl bash -c "sudo lsof -i :3306 | grep -v COMMAND | awk '{print \$2}' | xargs -r sudo kill -9 2>/dev/null || true"
timeout /t 2 /nobreak >nul
echo    Puerto 3306 liberado
echo.

echo [2/3] Iniciando contenedores MySQL y API...
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up -d mysql api"

echo.
echo [3/3] Esperando a que MySQL esté listo...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   Verificando estado de contenedores...
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"

echo.
echo ========================================
echo   Servicios disponibles en:
echo   - Frontend: http://localhost:4200
echo   - API: http://localhost:3001
echo   - MySQL: localhost:3306
echo ========================================
echo.
echo ¿Deseas ejecutar el seed ahora? (S/N)
set /p ejecutar_seed=

if /i "%ejecutar_seed%"=="S" (
    echo.
    echo ========================================
    echo   Ejecutando migraciones y seed...
    echo ========================================
    echo.
    
    wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose exec api npm run seed-with-migrations"
    echo.
    echo Migraciones y seed completados!
)

echo.
pause

