'use client';
import { useState } from 'react';
import styles from './SeoTool.module.css';

interface Check {
  id: number;
  name: string;
  passed: boolean;
  message: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

interface SeoResults {
  score: number;
  checks: Check[];
  suggestions?: string[];
  detailedSuggestions?: {
    checkId: number;
    title: string;
    description: string;
    steps: string[];
  }[];
}

export default function SeoTool() {
  const [url, setUrl] = useState<string>('');
  const [results, setResults] = useState<SeoResults | { error: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'suggestions'>('overview');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`/api/seo-check?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data as SeoResults);
      } else {
        setResults({ error: data.error || 'An error occurred' });
      }
    } catch (error) {
      console.error('Error:', error);
      setResults({ error: 'Failed to check SEO' });
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Yellow/Amber
    if (score >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>SEO Checker Tool</h1>
        <p className={styles.subtitle}>Analyze your website&#39;s SEO performance and get actionable recommendations</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className={styles.urlInput}
              required
            />
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? (
                <>
                  <span className={styles.spinner}/>
                  Checking...
                </>
              ) : (
                'Check SEO'
              )}
            </button>
          </div>
        </form>
      </div>

      {results && 'error' in results && (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{results.error}</p>
        </div>
      )}

      {results && !('error' in results) && (
        <div className={styles.resultsContainer}>
          <div className={styles.scoreContainer}>
            <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(results.score) }}>
              <span className={styles.scoreNumber} style={{ color: getScoreColor(results.score) }}>
                {results.score}
              </span>
              <span className={styles.scoreOutOf}>/100</span>
            </div>
            <div className={styles.scoreInfo}>
              <h2 className={styles.scoreLabel}>{getScoreLabel(results.score)}</h2>
              <p className={styles.scoreDescription}>
                Your website&#39;s SEO score is {results.score}/100. {results.score >= 80 
                  ? 'Great job! Your website is well optimized.' 
                  : 'There are several areas that could be improved.'}
              </p>
            </div>
          </div>

          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Detailed Results
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'suggestions' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              Suggestions
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <div className={styles.checkSummary}>
                <div className={styles.passedChecks}>
                  <span className={styles.checkCount}>{results.checks.filter(c => c.passed).length}</span>
                  <span className={styles.checkLabel}>Passed</span>
                </div>
                <div className={styles.failedChecks}>
                  <span className={styles.checkCount}>{results.checks.filter(c => !c.passed).length}</span>
                  <span className={styles.checkLabel}>Failed</span>
                </div>
              </div>

              <div className={styles.checksOverview}>
                {results.checks.map((check) => (
                  <div key={check.id} className={styles.checkOverviewItem}>
                    <div className={styles.checkStatus}>
                      {check.passed ? (
                        <span className={styles.passedIcon}>✓</span>
                      ) : (
                        <span className={styles.failedIcon}>✗</span>
                      )}
                    </div>
                    <div className={styles.checkInfo}>
                      <h3 className={styles.checkName}>{check.name}</h3>
                      <p className={styles.checkMessage}>{check.message}</p>
                    </div>
                    <div className={styles.importanceIndicator}>
                      <span 
                        className={styles.importanceDot} 
                        style={{ backgroundColor: getImportanceColor(check.importance) }}
                      />
                      <span className={styles.importanceLabel}>{check.importance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className={styles.detailsTab}>
              {results.checks.map((check) => (
                <div key={check.id} className={styles.checkDetail}>
                  <div className={styles.checkHeader}>
                    <div className={styles.checkStatus}>
                      {check.passed ? (
                        <span className={styles.passedIcon}>✓</span>
                      ) : (
                        <span className={styles.failedIcon}>✗</span>
                      )}
                    </div>
                    <h3 className={styles.checkName}>{check.name}</h3>
                    <div className={styles.importanceIndicator}>
                      <span 
                        className={styles.importanceDot} 
                        style={{ backgroundColor: getImportanceColor(check.importance) }}
                      />
                      <span className={styles.importanceLabel}>{check.importance}</span>
                    </div>
                  </div>
                  <div className={styles.checkBody}>
                    <p className={styles.checkMessage}>{check.message}</p>
                    <p className={styles.checkDescription}>{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className={styles.suggestionsTab}>
              {results.detailedSuggestions && results.detailedSuggestions.length > 0 ? (
                <div className={styles.detailedSuggestions}>
                  {results.detailedSuggestions.map((suggestion, index) => (
                    <div key={index} className={styles.suggestionCard}>
                      <h3 className={styles.suggestionTitle}>{suggestion.title}</h3>
                      <p className={styles.suggestionDescription}>{suggestion.description}</p>
                      <div className={styles.suggestionSteps}>
                        <h4 className={styles.stepsTitle}>How to fix:</h4>
                        <ol className={styles.stepsList}>
                          {suggestion.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className={styles.stepItem}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.basicSuggestions}>
                  <h3 className={styles.suggestionsTitle}>Basic Suggestions</h3>
                  <ul className={styles.suggestionsList}>
                    {results.suggestions && results.suggestions.map((suggestion, i) => (
                      <li key={i} className={styles.suggestionItem}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const runtime = 'nodejs'; // ✅ Important: disable Edge Runtime