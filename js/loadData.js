// CSV dosyasını yüklemek için Papa Parse kütüphanesini kullanın
import { parse } from 'https://cdn.skypack.dev/papaparse';

// CSV dosyasının URL'si
const csvFile = "C:\\Users\\beced\\OneDrive\\Masaüstü\\data.csv";

// Veri setini depolamak için boş bir nesne oluşturun
let dataSet = {};

// CSV dosyasını yükleme işlevi
const loadCSV = async () => {
  try {
    const response = await fetch(csvFile);
    const data = await response.text();
    
    // CSV dosyasını ayrıştırın ve veri setine atayın
    const parsedData = parse(data, { header: true });
    dataSet = parsedData.data.reduce((acc, row) => {
      for (const key in row) {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(parseFloat(row[key])); // Verileri sayıya dönüştürün
      }
      return acc;
    }, {});

    // Korelasyon katsayılarını hesaplayın
    const correlations = calculateCorrelations(dataSet);
    
    // Korelasyon katsayılarına göre faktörleri sıralayın
    const sortedCorrelations = {};
    for (const factor in correlations) {
      const factorCorrelations = correlations[factor];
      const sortedFactors = Object.keys(factorCorrelations).sort((a, b) => {
        return Math.abs(factorCorrelations[b]) - Math.abs(factorCorrelations[a]);
      });
      sortedCorrelations[factor] = sortedFactors;
    }
    
    // Sıralanmış korelasyon katsayılarını gösterin
    console.log(sortedCorrelations);
  } catch (error) {
    console.error('Error loading CSV:', error);
  }
};

// Korelasyon katsayılarını hesaplayan işlev
function calculateCorrelations(dataSet) {
  const correlations = {};
  const keys = Object.keys(dataSet);
  const n = keys.length;

  for (let i = 0; i < n; i++) {
    const xKey = keys[i];
    correlations[xKey] = {};

    for (let j = 0; j < n; j++) {
      const yKey = keys[j];
      if (xKey !== yKey) {
        const correlation = calculateCorrelation(dataSet[xKey], dataSet[yKey]);
        correlations[xKey][yKey] = correlation;
      }
    }
  }

  return correlations;
}

// Korelasyon katsayısını hesaplayan işlev (örnek olarak Pearson korelasyon katsayısı)
function calculateCorrelation(x, y) {
  const n = x.length;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denominatorX += Math.pow(diffX, 2);
    denominatorY += Math.pow(diffY, 2);
  }

  const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
  return correlation;
}

// Ortalamayı hesaplayan işlev
function calculateMean(data) {
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

// CSV dosyasını yükleyin
loadCSV();
