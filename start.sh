#!/bin/bash
cd ./src/
gunicorn wsgi:application
