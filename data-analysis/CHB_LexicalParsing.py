import json
import re
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use the 'Agg' backend, which is non-interactive
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
from statsmodels.formula.api import ols
from scipy import stats
from statsmodels.graphics.factorplots import interaction_plot

# Define the file path
file_path='data/chatbot-nu-default-rtdb-export.txt'

def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    frames = []
    for user_id, user_data in data['user'].items():
        if 'transcript' in user_data:
            df = pd.DataFrame(user_data['transcript']).T
            df['user_id'] = user_id
            df['group'] = user_data.get('experiment', {}).get('Group', 'Unknown')
            frames.append(df)
    
    return pd.concat(frames).reset_index(drop=True)

def calculate_eq_score(text):
    eq_score = 0
    
    # Cognitive empathy
    if re.search(r'\b(understand|realize|know how you feel)\b', text, re.IGNORECASE):
        eq_score += 1
    
    # Emotional empathy
    if re.search(r'\b(feel for you|share your|empathize)\b', text, re.IGNORECASE):
        eq_score += 1
    
    # Social skills
    if re.search(r'\b(let\'s talk|can we discuss|tell me more)\b', text, re.IGNORECASE):
        eq_score += 1
    
    return eq_score

def analyze_empathy(text):
    empathy_score = 0
    
    # Existing empathy markers
    if re.search(r'\b(we|us|our)\b', text, re.IGNORECASE):
        empathy_score += 1
    if re.search(r'\b(you|your)\b', text, re.IGNORECASE):
        empathy_score += 1
    if re.search(r'\b(is|are|am)\b', text, re.IGNORECASE):
        empathy_score += 1
    if re.search(r'\b(please|kindly)\b.*\b(do|send|try)\b', text, re.IGNORECASE):
        empathy_score += 1
    if re.search(r'\b(thank you|thanks|this is helpful)\b', text, re.IGNORECASE):
        empathy_score += 1
    if re.search(r'\b(we care|we understand|we know)\b', text, re.IGNORECASE):
        empathy_score += 1
    
    # Add EQ score
    empathy_score += calculate_eq_score(text)
    
    return empathy_score

def process_data(df):
    df['empathy_score'] = df['message'].apply(analyze_empathy)
    df['eq_score'] = df['message'].apply(calculate_eq_score)
    return df

def plot_empathy_scores(df):
    plt.figure(figsize=(12, 6))
    sns.boxplot(x='group', y='empathy_score', data=df)
    plt.title('Empathy Scores by Group')
    plt.savefig('empathy_scores.png')
    plt.close()

def plot_eq_scores(df):
    plt.figure(figsize=(12, 6))
    sns.boxplot(x='group', y='eq_score', data=df)
    plt.title('EQ-like Scores by Group')
    plt.savefig('results/eq_scores.png')
    plt.close()

def run_statistical_tests(df):
    # Kruskal-Wallis H-test
    h_statistic, p_value = stats.kruskal(*[group['empathy_score'].values for name, group in df.groupby('group')])
    print(f"Kruskal-Wallis H-test: h={h_statistic}, p={p_value}")

    # One-way ANOVA
    model = ols('empathy_score ~ C(group)', data=df).fit()
    anova_table = sm.stats.anova_lm(model, typ=2)
    print("\nOne-way ANOVA:")
    print(anova_table)

def plot_interaction(df):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    sns.pointplot(x='group', y='empathy_score', data=df, ax=ax1)
    ax1.set_title('Empathy Score by Group')
    
    sns.pointplot(x='group', y='eq_score', data=df, ax=ax2)
    ax2.set_title('EQ-like Score by Group')
    
    plt.tight_layout()
    plt.savefig('results/interaction_plot.png')
    plt.close()

# Main execution
df = load_data(file_path)
df = process_data(df)

plot_empathy_scores(df)
plot_eq_scores(df)
run_statistical_tests(df)
plot_interaction(df)

# Additional analysis: empathy progression over conversation
df['message_order'] = df.groupby('user_id').cumcount()
plt.figure(figsize=(12, 6))
sns.lineplot(x='message_order', y='empathy_score', hue='group', data=df)
plt.title('Empathy Score Progression Over Conversation')
plt.savefig('results/empathy_progression.png')
plt.close()

# Empathy score distribution
plt.figure(figsize=(12, 6))
sns.histplot(data=df, x='empathy_score', hue='group', multiple='stack')
plt.title('Distribution of Empathy Scores by Group')
plt.savefig('results/empathy_distribution.png')
plt.close()

# Correlation between empathy score and EQ score
correlation = df['empathy_score'].corr(df['eq_score'])
print(f"\nCorrelation between Empathy Score and EQ-like Score: {correlation}")

# Top empathetic responses
top_empathy = df.nlargest(10, 'empathy_score')
print("\nTop 10 Most Empathetic Responses:")
for _, row in top_empathy.iterrows():
    print(f"Group: {row['group']}, Score: {row['empathy_score']}, Message: {row['message'][:100]}...")

# Save the processed data to a CSV file
df.to_csv('results/processed_empathy_data.csv', index=False)
print("\nProcessed data saved to 'processed_empathy_data.csv'")
