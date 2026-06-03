export default function handler(req, res) {
  const startTime = Date.now();

  // Generamos un arreglo grande desordenado en la memoria RAM
  const size = 30000;
  const data = Array.from({ length: size }, () => Math.random());

  // Implementamos un ordenamiento de burbuja (Bubble Sort) explícito O(n^2)
  // Esto obliga a la CPU a realizar millones de operaciones continuas
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i - 1; j++) {
      if (data[j] > data[j + 1]) {
        let temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
      }
    }
  }

  const duration = Date.now() - startTime;

  res.status(200).json({ 
    success: true, 
    message: "Cálculo intensivo completado.", 
    executionTimeMs: duration 
  });
}
