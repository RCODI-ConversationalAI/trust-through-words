import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk import pos_tag
import re
from nltk.sentiment import SentimentIntensityAnalyzer

# Download necessary NLTK data
nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('vader_lexicon', quiet=True)

# Load the CSV file
filepath = r"C:\Users\me\OneDrive\Documents\RCODI\Empathy_AI\Expert Human Evaluation_All.csv"
df = pd.read_csv(filepath)

# Existing rules
def score_person_form(text):
    first_person_plural = len([word for word in text.split() if word.lower() in ["we", "us", "our"]])
    second_person = len([word for word in text.split() if word.lower() in ["you", "your"]])
    return first_person_plural + second_person

def score_pronouns(text):
    tokens = word_tokenize(text)
    pronouns = [word for word, pos in pos_tag(tokens) if pos == 'PRP']
    return len(pronouns)

def score_tense(text):
    tokens = word_tokenize(text)
    present_tense_verbs = len([word for word, pos in pos_tag(tokens) if pos in ['VBP', 'VBZ']])
    return present_tense_verbs

def score_exclamations(text):
    return text.count('!')

def score_stimulating_dialogue(text):
    stimulating_phrases = [
        r"\bshall we\b", r"\bhow about\b", r"could you please share",
        r"what are your thoughts on\b", r"\bwhat do you think about\b",
        r"\bwhy don't we\b", r"\bhave you considered\b"
    ]
    return sum(len(re.findall(phrase, text.lower())) for phrase in stimulating_phrases)

def score_acknowledging(text):
    acknowledging_phrases = [
        r"\bthank you for\b", r"\bthis is helpful\b", r"\bI appreciate\b",
        r"\bgood point\b", r"\bthat's a great idea\b", r"\bI understand\b",
        r"\bthanks for sharing\b"
    ]
    return sum(len(re.findall(phrase, text.lower())) for phrase in acknowledging_phrases)

def score_collective_reasoning(text):
    reasoning_phrases = [
        r"\bthinking together\b", r"\blet us think this through\b",
        r"\bas a team\b", r"\bworking together\b", r"\bjoin our heads\b",
        r"\bcollectively consider\b", r"\bmutual understanding\b"
    ]
    return sum(len(re.findall(phrase, text.lower())) for phrase in reasoning_phrases)

def score_caring_statements(text):
    sia = SentimentIntensityAnalyzer()
    sentiment = sia.polarity_scores(text)
    return sentiment['pos']

# New rules for sensitivity analysis
def score_empathetic_phrases(text):
    empathetic_phrases = [
        r"\bI see\b", r"\bI hear you\b", r"\bThat must be\b",
        r"\bIt sounds like\b", r"\bI can imagine\b", r"\bYou're not alone\b"
    ]
    return sum(len(re.findall(phrase, text.lower())) for phrase in empathetic_phrases)

def score_question_diversity(text):
    question_types = [r"\bwhat\b", r"\bwhy\b", r"\bhow\b", r"\bwhen\b", r"\bwhere\b", r"\bwho\b"]
    return sum(1 for phrase in question_types if re.search(phrase, text.lower()))

# Apply rules to the dataset
def apply_rules(df, rules):
    for rule_name, rule_func in rules.items():
        df[rule_name] = df['message'].apply(rule_func)
    return df

# Define rule sets
base_rules = {
    'person_form': score_person_form,
    'pronouns': score_pronouns,
    'tense': score_tense,
    'exclamations': score_exclamations,
    'stimulating_dialogue': score_stimulating_dialogue,
    'acknowledging': score_acknowledging,
    'collective_reasoning': score_collective_reasoning,
    'caring_statements': score_caring_statements
}

extended_rules = base_rules.copy()
extended_rules.update({
    'empathetic_phrases': score_empathetic_phrases,
    'question_diversity': score_question_diversity
})

# Apply rule sets
df_base = apply_rules(df.copy(), base_rules)
df_extended = apply_rules(df.copy(), extended_rules)

# Calculate empathy scores
df_base['empathy_score'] = df_base[[rule for rule in base_rules.keys()]].sum(axis=1)
df_extended['empathy_score'] = df_extended[[rule for rule in extended_rules.keys()]].sum(axis=1)

# Compare results
print("Base Rules - Average Empathy Score:", df_base['empathy_score'].mean())
print("Extended Rules - Average Empathy Score:", df_extended['empathy_score'].mean())

# Correlation analysis
correlation_base = df_base['empathy_score'].corr(df_base['Warm'])
correlation_extended = df_extended['empathy_score'].corr(df_extended['Warm'])

print("\nCorrelation with 'Warm' rating:")
print("Base Rules:", correlation_base)
print("Extended Rules:", correlation_extended)

# Sensitivity analysis
print("\nSensitivity Analysis:")
for rule in extended_rules.keys():
    correlation = df_extended[rule].corr(df_extended['Warm'])
    print(f"{rule}: Correlation with 'Warm' rating = {correlation:.4f}")

# Identify messages with largest discrepancies
df_combined = df_base[['message', 'empathy_score']].copy()
df_combined['extended_score'] = df_extended['empathy_score']
df_combined['score_difference'] = df_combined['extended_score'] - df_combined['empathy_score']
df_combined = df_combined.sort_values('score_difference', ascending=False)

print("\nTop 5 messages with largest score increase:")
print(df_combined.head().to_string(index=False))

print("\nBottom 5 messages with largest score decrease:")
print(df_combined.tail().to_string(index=False))
