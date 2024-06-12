import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Veri setini yükle
data = pd.read_csv("C:\\Users\\beced\\OneDrive\\Masaüstü\\heart_2020_cleaned.csv")

# Veri setindeki her sütunun veri türlerini kontrol et


# LabelEncoder nesnesini oluştur
label_encoder = LabelEncoder()

# Kategorik sütunları dönüştür
categorical_columns = data.select_dtypes(include=['object']).columns
for col in categorical_columns:
    data[col] = label_encoder.fit_transform(data[col])

# Korelasyon matrisini hesapla
correlation_matrix = data.corr().abs()

# Korelasyon katsayılarını al ve sırala
correlations = correlation_matrix.unstack().sort_values()

# Korelasyon katsayılarını yazdır (küçükten büyüğe doğru sıralı)
print("Tüm Sütunlardaki Korelasyon Katsayıları:")
print(correlations[correlations != 0])