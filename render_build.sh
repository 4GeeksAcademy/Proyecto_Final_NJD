#!/usr/bin/env bash
# exit on error
set -o errexit

# Actualizar herramientas antes de instalar cualquier otra cosa
pip install --upgrade pip
pip install --upgrade setuptools
pip install --upgrade wheel
pip install --upgrade Cython

# Instalar dependencias del proyecto
npm install
npm run build

pipenv install
pipenv run upgrade
