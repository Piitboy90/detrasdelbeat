# Configuración de Row Level Security (RLS) en Supabase

Este documento explica cómo configurar la seguridad a nivel de fila (Row Level Security o RLS) para la tabla `posts` en Supabase. RLS es fundamental para asegurar que los usuarios solo puedan modificar o eliminar su propio contenido, mientras permiten que todos lean las publicaciones.

## ¿Qué es RLS?

Row Level Security (RLS) es una característica de PostgreSQL que permite restringir el acceso a filas específicas de una tabla basándose en quién está ejecutando la consulta (por ejemplo, el usuario autenticado).

En Supabase, esto se gestiona mediante **Policies** (Políticas).

## Configuración Paso a Paso

Para configurar RLS en tu tabla `posts`, ejecuta los siguientes comandos SQL en el **SQL Editor** de tu panel de Supabase.

### 1. Habilitar RLS en la tabla

Primero, asegúrate de que RLS esté activo en la tabla. Por defecto, si RLS está activo y no hay políticas, **nadie** puede acceder a los datos.