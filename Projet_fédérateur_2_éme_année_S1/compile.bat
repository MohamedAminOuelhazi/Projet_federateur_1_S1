@echo off
echo Compilation du document LaTeX...
cd /d "%~dp0"

echo.
echo === Premiere compilation ===
pdflatex -interaction=nonstopmode main.tex

echo.
echo === Deuxieme compilation (pour references) ===
pdflatex -interaction=nonstopmode main.tex

echo.
echo === Troisieme compilation (pour table des matieres) ===
pdflatex -interaction=nonstopmode main.tex

echo.
echo Compilation terminee!
echo Fichier PDF genere: main.pdf
pause
