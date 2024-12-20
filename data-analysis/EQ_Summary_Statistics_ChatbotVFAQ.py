import pandas as pd
import os

def print_summary_stats(stats, group_name):
    print(f"\nSummary Statistics for Group {group_name}:")
    print(stats)
    print("\n" + "="*50)

# Define the file path
file_path = r"C:\Users\me\OneDrive\Documents\RCODI\Empathy_AI\Expert Human Evaluation_All.csv"

# Check if the file exists
if not os.path.exists(file_path):
    print(f"Error: The file {file_path} does not exist.")
    exit()

# Read the CSV file
df = pd.read_csv(file_path)

# Define the columns we're interested in
columns_of_interest = ['Warm', 'Tender', 'Sympathetic', 'Softhearted', 'Moved', 'Compassionate', 'Mean']

# Create a new column for combined groups
df['combined_group'] = df['group'].apply(lambda x: 'ABCD' if x in ['A', 'B', 'C', 'D'] else 'FAQ')

# Analysis 1: Individual groups
print("Analysis 1: Individual Groups (A, B, C, D, FAQ)")
summary_stats_individual = df.groupby('group')[columns_of_interest].agg(['mean', 'median', 'min', 'max', 'std'])

for group in ['A', 'B', 'C', 'D', 'FAQ']:
    print_summary_stats(summary_stats_individual.loc[group], group)
    print(f"Average STD for Group {group}: {df[df['group'] == group]['STD'].mean():.4f}")

# Analysis 2: Combined ABCD group and FAQ
print("\nAnalysis 2: Combined ABCD Group and FAQ")
summary_stats_combined = df.groupby('combined_group')[columns_of_interest].agg(['mean', 'median', 'min', 'max', 'std'])

for group in ['ABCD', 'FAQ']:
    print_summary_stats(summary_stats_combined.loc[group], group)
    print(f"Average STD for Group {group}: {df[df['combined_group'] == group]['STD'].mean():.4f}")

# Overall summary statistics
overall_stats = df[columns_of_interest].agg(['mean', 'median', 'min', 'max', 'std'])
print("\nOverall Summary Statistics:")
print(overall_stats)
print(f"Overall Average STD: {df['STD'].mean():.4f}")

# Comparison: ABCD vs FAQ
print("\nComparison: ABCD vs FAQ")
abcd_mean = summary_stats_combined.loc['ABCD', (slice(None), 'mean')]
faq_mean = summary_stats_combined.loc['FAQ', (slice(None), 'mean')]
difference = abcd_mean - faq_mean
percent_difference = (difference / faq_mean) * 100

comparison_df = pd.DataFrame({
    'ABCD Mean': abcd_mean,
    'FAQ Mean': faq_mean,
    'Difference': difference,
    'Percent Difference': percent_difference
})

print(comparison_df)

# STD comparison
abcd_std = df[df['combined_group'] == 'ABCD']['STD'].mean()
faq_std = df[df['combined_group'] == 'FAQ']['STD'].mean()
std_diff = abcd_std - faq_std
std_percent_diff = (std_diff / faq_std) * 100

print(f"\nAverage STD Comparison:")
print(f"ABCD Average STD: {abcd_std:.4f}")
print(f"FAQ Average STD: {faq_std:.4f}")
print(f"Difference: {std_diff:.4f}")
print(f"Percent Difference: {std_percent_diff:.2f}%")