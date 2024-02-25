-- En este archivo deben estar tus ejercicios de consultas sql
-- 1. Empleados ordenados alfabéticamente (Z...A)
SELECT nombre
FROM empleados
ORDER BY nombre DESC;

-- 2. Empleados de Soporte
SELECT nombre, puesto, localidad
FROM empleados
WHERE puesto = 'Soporte';

-- 3. Nombres que terminan con 'o'
SELECT nombre
FROM empleados
WHERE nombre LIKE '%o';

-- 4. Empleados en Carlos Paz
SELECT nombre, sueldo, localidad
FROM empleados
WHERE localidad = 'Carlos Paz';

-- 5. Sueldos entre 10000 y 13000
SELECT nombre, sueldo, localidad
FROM empleados
WHERE sueldo BETWEEN 10000 AND 13000;

-- 6. Departamentos con más de 5 empleados
SELECT departamento_id
FROM empleados
GROUP BY departamento_id
HAVING COUNT(*) > 5;

-- 7. Empleados en Córdoba con puesto de Analista o Programador
SELECT nombre
FROM empleados
WHERE localidad = 'Córdoba' AND (puesto = 'Analista' OR puesto = 'Programador');

-- 8. Sueldo medio de todos los empleados
SELECT AVG(sueldo) AS sueldo_medio
FROM empleados;

-- 9. Máximo sueldo en el departamento 10
SELECT MAX(sueldo) AS max_sueldo
FROM empleados
WHERE departamento_id = 10;

-- 10. Sueldo mínimo en el departamento Soporte
SELECT MIN(sueldo) AS min_sueldo_soporte
FROM empleados
WHERE departamento_id = (SELECT id FROM departamentos WHERE nombre = 'Soporte');

-- 11. Suma de sueldos por puesto
SELECT puesto, SUM(sueldo) AS suma_sueldos
FROM empleados
GROUP BY puesto;
