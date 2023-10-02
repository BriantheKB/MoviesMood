import pandas as pd
from wordcloud import WordCloud, STOPWORDS
import matplotlib.pyplot as plt
import json

# Load data
with open("C:/Users/brian/OneDrive/Desktop/Mood and Movies/Dashboard Movie Moods/data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

df = pd.DataFrame(data)

# Extract decade
df['release_year'] = df['release_date'].str[:4]
df['decade'] = (df['release_year'].astype(int) // 10) * 10

# Group by decade
decades = df.groupby('decade')['overview'].apply(lambda x: ' '.join(x)).to_dict()

# Define additional stopwords
additional_stopwords = set(["one", "two", "three", "four", "girl", "new", "boy", "S", "five", "six", "seven", "way", "eight", "take", "nine", "will", "ten", "young", "find", "film", "make", "man", "woman", "life"])
stopwords = STOPWORDS.union(additional_stopwords)

# Generate and save word clouds
for decade, text in decades.items():
    wordcloud = WordCloud(background_color="white", stopwords=stopwords).generate(text)

    plt.figure(figsize=(10, 7))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.title(f"{decade}s Movie Descriptions")
    plt.savefig(f"C:/Users/brian/OneDrive/Desktop/Mood and Movies/Dashboard Movie Moods/{decade}_wordcloud.png", format="png")
    plt.close()


# Generate and save word cloud for all years combined
all_years_text = ' '.join(df['overview'])
wordcloud_all = WordCloud(background_color="white", stopwords=stopwords).generate(all_years_text)

plt.figure(figsize=(10, 7))
plt.imshow(wordcloud_all, interpolation="bilinear")
plt.axis("off")
plt.title("All Years Movie Descriptions")
plt.savefig("C:/Users/brian/OneDrive/Desktop/Mood and Movies/Dashboard Movie Moods/all_wordcloud.png", format="png")
plt.close()