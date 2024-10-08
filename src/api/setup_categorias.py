from sqlalchemy.exc import ProgrammingError  # Agregado para manejar el error cuando las tablas aún no están listas
from api.models import db, Categorias

def cargar_categorias_iniciales():
    try:
        if Categorias.query.count() == 0:  # Comprobamos si no hay categorías en la base de datos
            categorias_por_defecto = [
                "Italiana", "Argentina", "Mexicana", "Mediterránea", "China", 
                "Japonesa", "India", "Americana", "Tailandesa", "Arabe", 
                "Internacional", "Latinoamericana", "Saludable"
            ]
            for nombre in categorias_por_defecto:
                nueva_categoria = Categorias(nombre_de_categoria=nombre)
                db.session.add(nueva_categoria)
            db.session.commit()
            print("Categorías iniciales cargadas.")
        else:
            print("Las categorías ya están cargadas.")
    except ProgrammingError:  # Este bloque captura el error si las tablas aún no están creadas
        print("No se pueden cargar las categorías porque las tablas no están listas.")
