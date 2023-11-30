import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
let page: Page;

test.beforeAll(async ({browser}) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  //page.close();
})

test.describe("Flipboard E2E Complete test", () => {
  test("Registrar un nuevo usuario", async () => {
    await page.goto('http://localhost:3000/');
    await page.getByRole("link", { name: "Regístrate" }).click();
  
    await page.getByLabel('Nombre').fill('Tomas');
    await page.getByLabel('Apellido').fill('Tomtom');
    await page.getByLabel('Correo electrónico').fill('tomtomtom@gmail.com');
    await page.getByLabel('Contraseña').fill('Ejemplo123456');
  
    await page.getByRole("button", { name: "Registrarse" }).click();  
    await page.waitForURL('http://localhost:3000/cursos');
    await expect(page.getByText('Hola Tomas, ¡bienvenido!')).toBeVisible();
  });

  test("Crear e ingresar a un curso", async () => {
    await page.getByRole('button', { name: 'Crear nuevo curso' }).click();
    await page.getByPlaceholder('Nombre del curso').fill('Algoritmos y estructuras de datos 2023');
    await page.getByPlaceholder('Tema del curso').click();
    await page.getByPlaceholder('Tema del curso').fill('Estructuras de datos dinamicas');
    await page.locator('div').filter({ hasText: 'Descripción' }).nth(4).click();
    await page.getByPlaceholder('Correo electrónico de contacto').click();
    await page.getByPlaceholder('Correo electrónico de contacto').fill('AEDD2023@gmail.com');
    await page.getByRole('button', { name: 'Crear curso' }).click();
    await expect(page.getByText('Algoritmos y estructuras de datos 2023')).toBeVisible();

    await page.getByRole('button', { name: 'Algoritmos y estructuras de' }).click();
    await expect(page.locator('h3')).toContainText('El curso no posee murales creados');
  });

  test("Crear un nuevo mural, ingresar y navegar de regreso al curso", async () => {
    await page.getByRole('button', { name: 'Crear nuevo mural' }).click();
    await page.getByPlaceholder('Ej.: Teoría de grafos').click();
    await page.getByPlaceholder('Ej.: Teoría de grafos').fill('Punteros');
    await page.getByRole('button', { name: 'Crear mural' }).click();
    await page.getByRole('button', { name: 'Punteros FlipBoard' }).click();
    await page.waitForURL(/http:\/\/localhost:4000\/#room=.+/);
    await expect(page.getByRole('button', { name: 'Volver' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Evaluar' }).locator('div').first()).toBeVisible();
    await expect(page.getByLabel('Shapes').locator('div').filter({ hasText: 'To move canvas, hold mouse' }).nth(3)).toBeVisible();
    await page.getByRole('button', { name: 'Volver' }).click();
    await page.waitForURL(/http:\/\/localhost:3000\/.+\/murales/);
  });

  test("Navegar a la seccion participantes e intentar crear un grupo", async () => {
    await page.getByRole('link', { name: 'Ver participantes' }).click();
    await page.waitForURL(/http:\/\/localhost:3000\/.+\/participantes/);
    // que cargue la tabla de participantes
    await expect(page.getByLabel('Tomas Tomtom')).toContainText('tomtomtom@gmail.com');
    await page.getByRole('tab', { name: 'Grupos' }).press('Enter');
    // que cargue la tabla de grupos
    await page.getByRole('gridcell', { name: 'No se han encontrado grupos' }).click();
    //intentar crear grupo de 1 participante
    await page.getByRole('button', { name: 'Crear grupo' }).click();
    await page.getByLabel('Tomas Tomtom').getByRole('button').click();
    await page.getByRole('button', { name: 'Crear nuevo grupo' }).click();
    await expect(page.getByText('El grupo debe contener al')).toBeVisible();
    await page.getByLabel('Close').click();
  });

  test("Navegar a la seccion crear rubrica y crear una rubrica", async () => {
    await page.goto('http://localhost:3000/rubricas');
    await page.waitForURL('http://localhost:3000/rubricas');
    await page.getByRole('button', { name: 'Crear nueva rúbrica' }).click();
    await page.waitForURL('http://localhost:3000/rubricas/crear');
    await page.getByPlaceholder('Nombre de la rúbrica').click();
    await page.getByPlaceholder('Nombre de la rúbrica').fill('Nueva rubrica');
    await page.getByPlaceholder('Nombre del nivel').click();
    await page.getByPlaceholder('Nombre del nivel').fill('Nivel');
    await page.getByPlaceholder('Nombre del criterio').click();
    await page.getByPlaceholder('Nombre del criterio').fill('Criterio');
    await page.getByPlaceholder('Descripción del nivel').click();
    await page.getByPlaceholder('Descripción del nivel').fill('d1');
    await page.getByRole('button', { name: 'Crear rúbrica' }).click();
    await page.waitForURL('http://localhost:3000/rubricas');
    await expect(page.getByRole('main')).toContainText('Nueva Rubrica');
  });


})