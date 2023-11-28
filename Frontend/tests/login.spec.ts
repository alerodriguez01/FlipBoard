import { test, expect } from '@playwright/test';

test.describe('Registro', () => {

    test('Registrar usuario exitosamente', async ({ page }) => {
        
        await page.goto('http://localhost:3000/');

        await page.getByRole("link", { name: "Regístrate" }).click();

        await page.getByLabel('Nombre').fill('Juan');
        await page.getByLabel('Apellido').fill('Perez');
        await page.getByLabel('Correo electrónico').fill('juanperezexample@gmail.com');
        await page.getByLabel('Contraseña').fill('Ejemplo123456');

        await page.getByRole("button", { name: "Registrarse" }).click();  

        await page.waitForURL('http://localhost:3000/cursos');

        await expect(page.getByText('Hola Juan, ¡bienvenido!')).toBeVisible();
    });


});