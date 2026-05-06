@echo off
title Lanzador Tarelix
echo Lanzando Backend...
start cmd /k "npm run dev --prefix backend"
echo Lanzando Frontend...
start cmd /k "npm run dev --prefix frontend"
echo ¡Todo listo! Ya puedes cerrar esta ventana.
pause