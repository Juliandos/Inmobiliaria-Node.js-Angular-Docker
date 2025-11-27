@echo off
echo ========================================
echo   Reiniciando Docker con Seed
echo ========================================
echo.

echo [1/4] Deteniendo contenedores...
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose down"
echo    Contenedores detenidos
echo.

echo [2/4] Liberando puerto 3306...
wsl bash -c "sudo lsof -i :3306 | grep -v COMMAND | awk '{print \$2}' | xargs -r sudo kill -9 2>/dev/null || true"
timeout /t 2 /nobreak >nul
echo    Puerto 3306 liberado
echo.

echo [3/5] Iniciando contenedores MySQL y API...
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up -d mysql api"

echo.
echo [4/5] Esperando a que MySQL esté listo...
timeout /t 15 /nobreak >nul

echo.
echo [5/5] Ejecutando migraciones y seed de la base de datos...
echo ========================================
echo   Ejecutando migraciones y seed...
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose exec api npm run seed-with-migrations"

echo.
echo ========================================
echo   Verificando estado final...
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"

echo.
echo ========================================
echo   Proceso completado!
echo   Servicios disponibles en:
echo   - Frontend: http://localhost:4200
echo   - API: http://localhost:3001
echo   - MySQL: localhost:3306
echo ========================================
echo.
pause

