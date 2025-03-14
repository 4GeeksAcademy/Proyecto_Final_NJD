#!/usr/bin/env bash
# exit on error
set -o errexit

# Actualizar herramientas antes de instalar cualquier otra cosa
pip install --upgrade pip setuptools wheel Cython build

# Instalar dependencias del proyecto
npm install
npm run build

pip install -r requirements.txt
