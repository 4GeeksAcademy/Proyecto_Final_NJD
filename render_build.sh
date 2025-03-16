#!/usr/bin/env bash
# exit on error
set -o errexit

# Actualizar herramientas antes de instalar cualquier otra cosa
pip install --upgrade pip setuptools wheel
pip install Cython==0.29.36 build

# Instalar PyYAML de manera separada primero
pip install pyyaml==6.0 --no-build-isolation

# Instalar dependencias del proyecto
npm install
npm run build

# Instalar el resto de dependencias
grep -v "pyyaml" requirements.txt > requirements_without_yaml.txt
pip install -r requirements_without_yaml.txt