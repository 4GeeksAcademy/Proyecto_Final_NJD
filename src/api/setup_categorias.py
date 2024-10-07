from api.models import db, Categorias

def cargar_categorias_iniciales():
    if Categorias.query.count() == 0:
        categorias_por_defecto = [
            "Italiana", "Argentina", "Mexicana", "Mediterránea", "China", 
            "Japonesa", "India", "Americana", "Tailandesa", "Arabe", 
            "Internacional", "Latinoamérica", "Saludable"
        ]
        for nombre in categorias_por_defecto:
            nueva_categoria = Categorias(nombre_de_categoria=nombre)
            db.session.add(nueva_categoria)
        db.session.commit()
        print("Categorías iniciales cargadas.")
    else:
        print("Las categorías ya están cargadas.")
