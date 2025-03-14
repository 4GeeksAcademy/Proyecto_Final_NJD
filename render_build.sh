#!/usr/bin/env bash
# exit on error
set -o errexit

# Actualizar herramientas antes de instalar cualquier otra cosa
pip install --upgrade pip setuptools wheel
pip install Cython==0.29.24 build

# Instalar dependencias del proyecto
npm install
npm run build

# Usar pip para las dependencias de Python
pip install -r requirements.txt

# Ejecutar migraciones si es necesario
# Añade aquí cualquier comando para las migraciones de la base de datos