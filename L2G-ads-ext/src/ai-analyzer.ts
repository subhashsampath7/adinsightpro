import { AdData } from './types';

interface AnalysisResult {
    type: string;
    title: string;
    insights: string;
    recommendations: string[];
    data: any;
    timestamp: string;
}

interface EmergingAdvertiser {
    name: string;
    adCount: number;
    domains: number;
    avgSpend?: string;
    avgTimeShown?: string;
}

interface DecliningAdvertiser {
    name: string;
    decline: number;
}

interface DomainTrend {
    direction: string;
    change: number;
}

interface SpendingInsights {
    totalSpendRange: string;
    avgMinSpend: number;
    avgMaxSpend: number;
    spendDistribution: Record<string, number>;
    topSpenders: Array<{ name: string; spendRange: string; adCount: number }>;
}

interface TimeShownInsights {
    avgTimeShown: string;
    totalImpressions: string;
    topPerformers: Array<{ name: string; timeShown: string; adCount: number }>;
}

export class AIAnalyzer {
    private apiKey: string;
    private apiUrl = 'https://api.openai.com/v1/chat/completions';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async callOpenAI(prompt: string, systemPrompt: string = ''): Promise<string> {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4-turbo-preview',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt || 'You are an expert marketing analyst specializing in digital advertising, competitive intelligence, and data-driven marketing strategies. Provide actionable, specific insights based on the data provided.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 3000
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to get AI analysis. Please check your API key and try again.');
        }
    }

    // Calculate spending insights - FIXED
    private calculateSpendingInsights(data: AdData[]): SpendingInsights {
        const adsWithSpending = data.filter(ad => ad.minSpend && ad.maxSpend);
        
        let totalMin = 0;
        let totalMax = 0;
        const spendDistribution: Record<string, number> = {
            'Under $500': 0,
            '$500-$1,000': 0,
            '$1,000-$5,000': 0,
            '$5,000-$20,000': 0,
            '$20,000-$50,000': 0,
            '$50,000+': 0
        };

        const advertiserSpending: Record<string, { total: number; count: number; range: string }> = {};

        adsWithSpending.forEach(ad => {
            const min = parseInt(ad.minSpend || '0');
            const max = parseInt(ad.maxSpend || '0');
            
            if (!isNaN(min) && !isNaN(max)) {
                totalMin += min;
                totalMax += max;
                
                // Values are already in dollars (not cents)
                const avg = (min + max) / 2;
                
                // Categorize spending
                if (avg < 500) spendDistribution['Under $500']++;
                else if (avg < 1000) spendDistribution['$500-$1,000']++;
                else if (avg < 5000) spendDistribution['$1,000-$5,000']++;
                else if (avg < 20000) spendDistribution['$5,000-$20,000']++;
                else if (avg < 50000) spendDistribution['$20,000-$50,000']++;
                else spendDistribution['$50,000+']++;

                // Track advertiser spending
                if (!advertiserSpending[ad.advertiserName]) {
                    advertiserSpending[ad.advertiserName] = { 
                        total: 0, 
                        count: 0, 
                        range: ad.spendRange || 'N/A' 
                    };
                }
                advertiserSpending[ad.advertiserName].total += avg;
                advertiserSpending[ad.advertiserName].count++;
            }
        });

        const topSpenders = Object.entries(advertiserSpending)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10)
            .map(([name, data]) => ({
                name,
                spendRange: data.range,
                adCount: data.count
            }));

        return {
            totalSpendRange: `$${totalMin.toLocaleString()} - $${totalMax.toLocaleString()}`,
            avgMinSpend: adsWithSpending.length > 0 ? totalMin / adsWithSpending.length : 0,
            avgMaxSpend: adsWithSpending.length > 0 ? totalMax / adsWithSpending.length : 0,
            spendDistribution,
            topSpenders
        };
    }

    // Calculate time shown insights - FIXED
    private calculateTimeShownInsights(data: AdData[]): TimeShownInsights {
        const adsWithTimeShown = data.filter(ad => ad.minShownRange && ad.maxShownRange);
        
        let totalMin = 0;
        let totalMax = 0;
        const advertiserTimeShown: Record<string, { total: number; count: number; range: string }> = {};

        adsWithTimeShown.forEach(ad => {
            const min = parseInt(ad.minShownRange || '0');
            const max = parseInt(ad.maxShownRange || '0');
            
            if (!isNaN(min) && !isNaN(max)) {
                totalMin += min;
                totalMax += max;
                
                const avg = (min + max) / 2;
                
                if (!advertiserTimeShown[ad.advertiserName]) {
                    advertiserTimeShown[ad.advertiserName] = { 
                        total: 0, 
                        count: 0, 
                        range: ad.shownRange || 'N/A' 
                    };
                }
                advertiserTimeShown[ad.advertiserName].total += avg;
                advertiserTimeShown[ad.advertiserName].count++;
            }
        });

        const topPerformers = Object.entries(advertiserTimeShown)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10)
            .map(([name, data]) => ({
                name,
                timeShown: data.range,
                adCount: data.count
            }));

        const avgMin = adsWithTimeShown.length > 0 ? totalMin / adsWithTimeShown.length : 0;
        const avgMax = adsWithTimeShown.length > 0 ? totalMax / adsWithTimeShown.length : 0;

        return {
            avgTimeShown: `${Math.round(avgMin).toLocaleString()} - ${Math.round(avgMax).toLocaleString()}`,
            totalImpressions: `${totalMin.toLocaleString()} - ${totalMax.toLocaleString()}`,
            topPerformers
        };
    }

    // 1. MARKET OVERVIEW ANALYSIS (Enhanced)
    async analyzeMarket(data: AdData[]): Promise<AnalysisResult> {
        const stats = this.calculateMarketStats(data);
        const spendingInsights = this.calculateSpendingInsights(data);
        const timeShownInsights = this.calculateTimeShownInsights(data);
        
        const prompt = `
Analyze this Google Ads Transparency data and provide strategic marketing insights:

**MARKET DATA:**
- Total Ads Analyzed: ${data.length}
- Date Range: ${stats.dateRange}
- Unique Advertisers: ${stats.uniqueAdvertisers}
- Unique Domains: ${stats.uniqueDomains}
- Average Campaign Duration: ${stats.avgDuration} days

**SPENDING INSIGHTS:**
- Total Market Spend Range: ${spendingInsights.totalSpendRange}
- Average Spend per Ad: $${spendingInsights.avgMinSpend.toFixed(0)} - $${spendingInsights.avgMaxSpend.toFixed(0)}
- Spend Distribution:
${Object.entries(spendingInsights.spendDistribution).map(([range, count]) => `  ${range}: ${count} ads (${((count/data.length)*100).toFixed(1)}%)`).join('\n')}

**TOP 10 SPENDERS:**
${spendingInsights.topSpenders.map((s, i) => `${i+1}. ${s.name} - ${s.spendRange} (${s.adCount} ads)`).join('\n')}

**TIME SHOWN / IMPRESSIONS:**
- Average Time Shown: ${timeShownInsights.avgTimeShown}
- Total Impressions Range: ${timeShownInsights.totalImpressions}

**TOP PERFORMERS BY IMPRESSIONS:**
${timeShownInsights.topPerformers.map((p, i) => `${i+1}. ${p.name} - ${p.timeShown} impressions (${p.adCount} ads)`).join('\n')}

**TOP 10 ADVERTISERS BY AD VOLUME:**
${stats.topAdvertisers.map((a, i) => `${i+1}. ${a.name} - ${a.count} ads (${a.percentage}% market share)`).join('\n')}

**TOP 10 ADVERTISING DOMAINS:**
${stats.topDomains.map((d, i) => `${i+1}. ${d.name} - ${d.count} ads`).join('\n')}

**MONTHLY AD DISTRIBUTION:**
${Object.entries(stats.monthlyDistribution).map(([month, count]) => `${month}: ${count} ads`).join('\n')}

Please provide a comprehensive analysis with:

1. **Executive Summary** (2-3 sentences highlighting key findings)
2. **Market Dynamics**: Key trends, competitive intensity, market maturity, and spending patterns
3. **Budget Intelligence**: 
   - What budget levels are most common?
   - Entry barriers for new advertisers
   - ROI implications by budget tier
4. **Performance Insights**:
   - Correlation between spending and impressions
   - Which advertisers get best bang for buck?
   - Efficiency benchmarks
5. **Dominant Players**: Analysis of top advertisers and their strategies
6. **Domain Insights**: Which platforms deliver best results
7. **Timing Intelligence**: Best months/periods for advertising
8. **Competitive Gaps**: Underserved niches or opportunities
9. **Budget Recommendations by Tier**:
   - Micro budgets ($100-$500): What's possible?
   - Small budgets ($500-$1,000): Realistic expectations
   - Medium budgets ($5,000-$20,000): Competitive positioning
   - Large budgets ($50,000+): Market domination strategies
10. **Strategic Recommendations**: 7-10 specific, actionable recommendations

Format your response with clear headers and bullet points for readability.
        `;

        const insights = await this.callOpenAI(prompt);
        
        return {
            type: 'market_analysis',
            title: 'Market Overview & Competitive Landscape',
            insights,
            recommendations: this.extractRecommendations(insights),
            data: { ...stats, spendingInsights, timeShownInsights },
            timestamp: new Date().toISOString()
        };
    }

    // 2. COMPETITOR DEEP DIVE (Enhanced)
    async analyzeCompetitor(advertiserName: string, allData: AdData[]): Promise<AnalysisResult> {
        const competitorAds = allData.filter(ad => ad.advertiserName === advertiserName);
        const competitorStats = this.calculateCompetitorStats(competitorAds, allData);
        
        // Calculate competitor spending
        const competitorSpending = competitorAds
            .filter(ad => ad.spendRange)
            .map(ad => ad.spendRange || 'N/A');
        
        const competitorImpressions = competitorAds
            .filter(ad => ad.shownRange)
            .map(ad => ad.shownRange || 'N/A');

        const prompt = `
Perform a deep competitive analysis on: **${advertiserName}**

**COMPETITOR METRICS:**
- Total Ads: ${competitorAds.length}
- Market Share: ${competitorStats.marketShare}%
- Active Period: ${competitorStats.activePeriod}
- Average Campaign Duration: ${competitorStats.avgDuration} days
- Total Days Advertised: ${competitorStats.totalDays}

**SPENDING ANALYSIS:**
${competitorSpending.length > 0 ? `
- Spend Ranges: ${competitorSpending.slice(0, 5).join(', ')}
- Total Ads with Spending Data: ${competitorSpending.length}
- Average Spend Pattern: ${competitorSpending.length > 0 ? 'Available' : 'Limited data'}
` : '- Spending data not available'}

**PERFORMANCE METRICS:**
${competitorImpressions.length > 0 ? `
- Impression Ranges: ${competitorImpressions.slice(0, 5).join(', ')}
- Total Reach: ${competitorImpressions.length} campaigns tracked
- Performance Consistency: ${competitorImpressions.length > 5 ? 'High' : 'Moderate'}
` : '- Impression data not available'}

**ADVERTISING DOMAINS:**
${competitorStats.domains.map((d, i) => `${i+1}. ${d.domain} (${d.count} ads)`).join('\n')}

**CAMPAIGN TIMELINE:**
${Object.entries(competitorStats.timeline).map(([month, count]) => `${month}: ${count} campaigns`).join('\n')}

**CAMPAIGN PATTERNS:**
- Longest Campaign: ${competitorStats.longestCampaign} days
- Shortest Campaign: ${competitorStats.shortestCampaign} days
- Most Active Month: ${competitorStats.mostActiveMonth}

Provide:

1. **Strategy Assessment**: What advertising strategy are they using?
2. **Budget Analysis**: 
   - Estimated monthly/annual ad spend (provide specific range)
   - Budget allocation strategy
   - Spending efficiency vs competitors
3. **Performance Analysis**:
   - Impression volume assessment
   - Cost per impression estimates
   - ROI indicators
4. **Target Audience**: Who are they trying to reach?
5. **Strengths**: What they're doing well (4-5 points with evidence)
6. **Weaknesses**: Gaps or vulnerabilities in their strategy (4-5 points)
7. **Competitive Positioning**: How they compare to market leaders
8. **Budget Benchmarking**: How their spending compares to category average
9. **Counter-Strategy**: Specific tactics to compete against them (7-8 recommendations)
10. **Opportunity Analysis**: How to exploit their weaknesses with specific budget recommendations

Be specific with numbers, provide budget ranges, and give actionable insights.
        `;

        const insights = await this.callOpenAI(prompt);

        return {
            type: 'competitor_analysis',
            title: `Competitor Analysis: ${advertiserName}`,
            insights,
            recommendations: this.extractRecommendations(insights),
            data: { ...competitorStats, spending: competitorSpending, impressions: competitorImpressions },
            timestamp: new Date().toISOString()
        };
    }

    // 3. CAMPAIGN OPTIMIZATION (Enhanced)
    async optimizeCampaign(campaignData: any, marketData: AdData[]): Promise<AnalysisResult> {
        const benchmarks = this.calculateBenchmarks(marketData);
        const spendingInsights = this.calculateSpendingInsights(marketData);
        const timeShownInsights = this.calculateTimeShownInsights(marketData);
        
        // Map budget to actual ranges
        const budgetRanges: Record<string, string> = {
            'micro': '$100 - $500',
            'small': '$500 - $1,000',
            'low': '$1,000 - $5,000',
            'medium': '$5,000 - $20,000',
            'high': '$20,000 - $50,000',
            'enterprise': '$50,000+'
        };
        
        const prompt = `
I want to launch a Google Ads campaign. Help me optimize it based on comprehensive market data.

**MY CAMPAIGN PARAMETERS:**
- Target Domain: ${campaignData.domain || 'Not specified - recommend best options'}
- Duration: ${campaignData.duration} days
- Budget Range: ${budgetRanges[campaignData.budget] || campaignData.budget}
- Budget Tier: ${campaignData.budget}

**MARKET BENCHMARKS:**
- Average Campaign Duration: ${benchmarks.avgDuration} days
- Most Popular Domains: ${benchmarks.topDomains.slice(0, 5).join(', ')}
- Peak Advertising Months: ${benchmarks.peakMonths.join(', ')}
- Competitive Intensity: ${benchmarks.competitionLevel}
- Average Ads per Advertiser: ${benchmarks.avgAdsPerAdvertiser}

**SPENDING BENCHMARKS FOR YOUR BUDGET TIER:**
- Market Average Spend: $${spendingInsights.avgMinSpend.toFixed(0)} - $${spendingInsights.avgMaxSpend.toFixed(0)}
- Your Budget Positioning: ${this.getBudgetPositioning(campaignData.budget, spendingInsights)}
- Expected Competition Level: ${this.getCompetitionLevel(campaignData.budget)}

**PERFORMANCE BENCHMARKS:**
- Average Impressions: ${timeShownInsights.avgTimeShown}
- Top Performer Impressions: ${timeShownInsights.topPerformers[0]?.timeShown || 'N/A'}
- Expected Reach for Your Budget: ${this.estimateReach(campaignData.budget)}

**MARKET CONTEXT:**
- Total Active Advertisers: ${benchmarks.totalAdvertisers}
- Total Domains: ${benchmarks.totalDomains}
- Market Saturation: ${benchmarks.saturationLevel}

Provide a detailed campaign plan tailored to the ${budgetRanges[campaignData.budget]} budget:

1. **Budget Reality Check**:
   - What's realistically achievable with this budget?
   - Expected impressions/reach
   - Competitive positioning at this tier
   - Should they increase budget? Why/why not?

2. **Optimal Timing**: 
   - Best start date (month/season)
   - Recommended duration for this budget
   - Days of week to focus on
   - Time-of-day optimization

3. **Domain Strategy**:
   - Top 5 recommended domains (with specific reasons and expected costs)
   - Domains to avoid at this budget level
   - Domain diversification strategy
   - Budget allocation per domain

4. **Budget Allocation Plan**:
   - Daily spend recommendation
   - Weekly budget distribution
   - Reserve for testing (specific amount)
   - Contingency fund (specific amount)
   - Phase 1, 2, 3 spending strategy

5. **Expected Performance**:
   - Estimated impressions (range)
   - Expected click-through rate
   - Estimated conversions
   - Cost per impression
   - Cost per click estimates

6. **Creative Strategy**:
   - Messaging recommendations for this budget tier
   - Visual elements to emphasize
   - Call-to-action suggestions
   - A/B testing priorities

7. **Targeting Recommendations**:
   - Audience segments to focus on
   - Geographic considerations
   - Device targeting
   - Demographic sweet spots

8. **Success Metrics**:
   - KPIs to track
   - Realistic performance targets for this budget
   - Benchmarks for success
   - Red flags to watch for

9. **Scaling Strategy**:
   - When to increase budget
   - How to scale efficiently
   - Budget milestones

10. **Competitive Advantage**:
    - How to compete with bigger spenders
    - Niche opportunities
    - Unique positioning for this budget tier

Provide specific numbers, dollar amounts, and realistic expectations. Be honest about limitations and opportunities.
        `;

        const insights = await this.callOpenAI(prompt);

        return {
            type: 'campaign_optimization',
            title: 'Campaign Optimization Plan',
            insights,
            recommendations: this.extractRecommendations(insights),
            data: { campaignData, benchmarks, spendingInsights, timeShownInsights },
            timestamp: new Date().toISOString()
        };
    }

    // 4. ROI ESTIMATION (Enhanced)
    async estimateROI(campaignData: any, marketData: AdData[]): Promise<AnalysisResult> {
        const benchmarks = this.calculateBenchmarks(marketData);
        const spendingInsights = this.calculateSpendingInsights(marketData);
        const timeShownInsights = this.calculateTimeShownInsights(marketData);

        const budgetRanges: Record<string, string> = {
            'micro': '$100 - $500',
            'small': '$500 - $1,000',
            'low': '$1,000 - $5,000',
            'medium': '$5,000 - $20,000',
            'high': '$20,000 - $50,000',
            'enterprise': '$50,000+'
        };

        const prompt = `
Estimate ROI and financial projections for this campaign with detailed spending and performance data.

**CAMPAIGN DETAILS:**
- Budget Range: ${budgetRanges[campaignData.budget] || campaignData.budget}
- Duration: ${campaignData.duration} days
- Target Domain: ${campaignData.domain || 'Multiple'}

**MARKET FINANCIAL DATA:**
- Market Average Spend: $${spendingInsights.avgMinSpend.toFixed(0)} - $${spendingInsights.avgMaxSpend.toFixed(0)}
- Average Impressions: ${timeShownInsights.avgTimeShown}
- Top Performer Spend: ${spendingInsights.topSpenders[0]?.spendRange || 'N/A'}
- Top Performer Impressions: ${timeShownInsights.topPerformers[0]?.timeShown || 'N/A'}

**PERFORMANCE BENCHMARKS:**
- Competitive Intensity: ${benchmarks.competitionLevel}
- Market Saturation: ${benchmarks.saturationLevel}
- Average Campaign Duration: ${benchmarks.avgDuration} days

Provide detailed financial analysis:

1. **Cost Estimation**:
   - Total investment required (breakdown)
   - Daily/weekly budget breakdown
   - Hidden costs to consider (15-20% buffer)
   - Platform fees estimates
   - Cost per impression (CPM) estimates
   - Cost per click (CPC) estimates
   - Cost per acquisition (CPA) estimates

2. **Expected Reach & Performance**:
   - Potential impressions (conservative, realistic, optimistic)
   - Expected click-through rate (based on market data)
   - Estimated conversions (with conversion rate assumptions)
   - Audience size projections
   - Engagement rate estimates

3. **ROI Projections** (with specific numbers):
   - **Conservative scenario** (worst case):
     * Impressions: [number]
     * Conversions: [number]
     * Revenue: $[amount]
     * ROI: [percentage]%
   - **Realistic scenario** (expected):
     * Impressions: [number]
     * Conversions: [number]
     * Revenue: $[amount]
     * ROI: [percentage]%
   - **Optimistic scenario** (best case):
     * Impressions: [number]
     * Conversions: [number]
     * Revenue: $[amount]
     * ROI: [percentage]%

4. **Break-even Analysis**:
   - Time to break even (days)
   - Required conversion rate (%)
   - Minimum performance thresholds
   - Daily revenue targets

5. **Revenue Projections by Phase**:
   - Week 1-2: $[amount] (learning phase)
   - Week 3-4: $[amount] (optimization phase)
   - Month 2: $[amount] (scaling phase)
   - Month 3-6: $[amount] (mature phase)
   - Long-term value (LTV) estimates

6. **Budget Tier Comparison**:
   - How would ROI change with 2x budget?
   - How would ROI change with 0.5x budget?
   - Optimal budget recommendation

7. **Risk Assessment**:
   - Financial risks (specific scenarios)
   - Probability of success (%)
   - Downside protection strategies
   - When to cut losses

8. **Optimization for Maximum ROI**:
   - Quick wins for better returns (with timeline)
   - Long-term optimization strategies
   - Testing budget allocation
   - Scaling triggers

9. **Industry Benchmarking**:
   - How does this compare to industry standards?
   - What ROI should you target?
   - Red flags if performance is below X%
   - Success indicators

10. **Financial Recommendations**:
    - Should you proceed with this budget?
    - Alternative budget scenarios
    - Risk mitigation strategies
    - Exit strategy if underperforming

Provide SPECIFIC numbers, percentages, dollar amounts, and ranges. Base estimates on the actual market data provided. Be realistic but also show upside potential.
        `;

        const insights = await this.callOpenAI(prompt);

        return {
            type: 'roi_estimation',
            title: 'ROI Estimation & Financial Projections',
            insights,
            recommendations: this.extractRecommendations(insights),
            data: { campaignData, benchmarks, spendingInsights, timeShownInsights },
            timestamp: new Date().toISOString()
        };
    }

    // 5. TREND PREDICTION (Enhanced)
    async predictTrends(data: AdData[]): Promise<AnalysisResult> {
        const trends = this.calculateTrendData(data);
        const spendingInsights = this.calculateSpendingInsights(data);
        const timeShownInsights = this.calculateTimeShownInsights(data);

        const prompt = `
Analyze advertising trends and predict future market movements with spending and performance data.

**HISTORICAL TREND DATA:**

**Monthly Growth Rates:**
${Object.entries(trends.monthlyGrowth).map(([month, growth]) => `${month}: ${growth > 0 ? '+' : ''}${growth}%`).join('\n')}

**Spending Trends:**
- Current Average Spend: $${spendingInsights.avgMinSpend.toFixed(0)} - $${spendingInsights.avgMaxSpend.toFixed(0)}
- Spend Distribution: ${Object.entries(spendingInsights.spendDistribution).map(([range, count]) => `${range}: ${count}`).join(', ')}
- Budget Trend: ${this.analyzeBudgetTrend(spendingInsights)}

**Performance Trends:**
- Average Impressions: ${timeShownInsights.avgTimeShown}
- Top Performers: ${timeShownInsights.topPerformers.slice(0, 3).map(p => p.name).join(', ')}

**Emerging Advertisers** (new in last 3 months):
${trends.emergingAdvertisers.length > 0 ? trends.emergingAdvertisers.map(a => `- ${a.name} (${a.adCount} ads, ${a.domains} domains)`).join('\n') : 'None identified'}

**Market Velocity:**
- New Advertisers per Month: ${trends.newAdvertisersRate}
- Churn Rate: ${trends.churnRate}%
- Market Growth Rate: ${trends.overallGrowth}%

Provide:

1. **6-Month Forecast**:
   - Expected market size (number of ads)
   - Growth projections (%)
   - Spending projections
   - Emerging trends

2. **Budget Trends**:
   - Are budgets increasing or decreasing?
   - Which budget tiers are growing fastest?
   - Entry barrier changes

3. **Performance Trends**:
   - Impression volume trends
   - Efficiency improvements
   - Cost trends (CPM, CPC)

4. **Emerging Opportunities**:
   - New niches to explore
   - Underserved markets
   - Innovation opportunities
   - Budget sweet spots

5. **Declining Sectors**:
   - What's losing momentum
   - Why it's declining
   - Should you avoid or double down?

6. **Disruptive Trends**:
   - Game-changing patterns
   - Technology impacts
   - Consumer behavior shifts

7. **Investment Recommendations by Budget Tier**:
   - Micro/Small budgets: Where to focus
   - Medium budgets: Growth opportunities
   - Large budgets: Market domination plays

8. **Competitive Dynamics**:
   - How competition will evolve
   - New entrants to watch
   - Consolidation predictions

9. **Strategic Positioning**:
   - How to position for future success
   - First-mover advantages
   - Defensive strategies

10. **Timeline & Action Plan**:
    - Q1 2025: What to do
    - Q2 2025: What to prepare for
    - Q3-Q4 2025: Long-term positioning

Be specific with timeframes, percentages, dollar amounts, and actionable insights.
        `;

        const insights = await this.callOpenAI(prompt);

        return {
            type: 'trend_prediction',
            title: 'Market Trends & Future Predictions',
            insights,
            recommendations: this.extractRecommendations(insights),
            data: { ...trends, spendingInsights, timeShownInsights },
            timestamp: new Date().toISOString()
        };
    }

    // 6. CUSTOM QUESTION (Enhanced)
    async askCustomQuestion(question: string, data: AdData[]): Promise<AnalysisResult> {
        const context = this.generateDataContext(data);
        const spendingInsights = this.calculateSpendingInsights(data);
        const timeShownInsights = this.calculateTimeShownInsights(data);

        const prompt = `
User Question: ${question}

**AVAILABLE DATA CONTEXT:**
${context}

**SPENDING DATA:**
- Average Spend: $${spendingInsights.avgMinSpend.toFixed(0)} - $${spendingInsights.avgMaxSpend.toFixed(0)}
- Total Market Spend: ${spendingInsights.totalSpendRange}
- Top Spenders: ${spendingInsights.topSpenders.slice(0, 3).map(s => `${s.name} (${s.spendRange})`).join(', ')}

**PERFORMANCE DATA:**
- Average Impressions: ${timeShownInsights.avgTimeShown}
- Top Performers: ${timeShownInsights.topPerformers.slice(0, 3).map(p => `${p.name} (${p.timeShown})`).join(', ')}

Please answer the user's question with:
1. Direct answer to their question (with specific data points)
2. Supporting data and evidence from the dataset
3. Spending and performance insights relevant to their question
4. Actionable recommendations (5-7 specific actions)
5. Budget implications if relevant
6. Additional insights they might find valuable

Be specific, data-driven, include numbers and percentages, and make it actionable.
        `;

        const insights = await this.callOpenAI(prompt);

        return {
            type: 'custom_question',
            title: 'Custom Analysis',
            insights,
            recommendations: this.extractRecommendations(insights),
            data: { question, spendingInsights, timeShownInsights },
            timestamp: new Date().toISOString()
        };
    }

    // HELPER METHODS

    private getBudgetPositioning(budgetTier: string, spendingInsights: SpendingInsights): string {
        const avgSpend = (spendingInsights.avgMinSpend + spendingInsights.avgMaxSpend) / 2;
        
        const tierValues: Record<string, number> = {
            'micro': 300,
            'small': 750,
            'low': 3000,
            'medium': 12500,
            'high': 35000,
            'enterprise': 75000
        };
        
        const tierValue = tierValues[budgetTier] || 0;
        
        if (tierValue < avgSpend * 0.5) return 'Below Market Average - Expect limited reach';
        if (tierValue < avgSpend) return 'Below Market Average - Competitive but manageable';
        if (tierValue < avgSpend * 2) return 'Market Average - Good competitive positioning';
        return 'Above Market Average - Strong competitive advantage';
    }

    private getCompetitionLevel(budgetTier: string): string {
        const levels: Record<string, string> = {
            'micro': 'Low - Niche targeting recommended',
            'small': 'Low-Medium - Focus on specific segments',
            'low': 'Medium - Moderate competition expected',
            'medium': 'Medium-High - Competitive market',
            'high': 'High - Intense competition',
            'enterprise': 'Very High - Market leader territory'
        };
        return levels[budgetTier] || 'Unknown';
    }

    private estimateReach(budgetTier: string): string {
        const reaches: Record<string, string> = {
            'micro': '5,000 - 15,000 impressions',
            'small': '15,000 - 50,000 impressions',
            'low': '50,000 - 200,000 impressions',
            'medium': '200,000 - 1,000,000 impressions',
            'high': '1,000,000 - 5,000,000 impressions',
            'enterprise': '5,000,000+ impressions'
        };
        return reaches[budgetTier] || 'Unknown';
    }

    private analyzeBudgetTrend(spendingInsights: SpendingInsights): string {
        const distribution = spendingInsights.spendDistribution;
        const lowBudget = distribution['Under $500'] + distribution['$500-$1,000'];
        const highBudget = distribution['$20,000-$50,000'] + distribution['$50,000+'];
        
        if (lowBudget > highBudget * 2) return 'Trending toward lower budgets - accessible market';
        if (highBudget > lowBudget * 2) return 'Trending toward higher budgets - premium market';
        return 'Mixed budget distribution - diverse market';
    }

    private calculateMarketStats(data: AdData[]) {
        const uniqueAdvertisers = new Set(data.map(d => d.advertiserName)).size;
        const uniqueDomains = new Set(data.map(d => d.domain).filter(Boolean)).size;
        
        const advertiserCounts = this.countBy(data, 'advertiserName');
        const domainCounts = this.countBy(data, 'domain');
        
        const totalDays = data.reduce((sum, ad) => sum + ad.totalDisplayDays, 0);
        const avgDuration = totalDays / data.length;

        const topAdvertisers = this.getTop(advertiserCounts, 10).map(item => ({
            ...item,
            percentage: ((item.count / data.length) * 100).toFixed(1)
        }));

        return {
            dateRange: this.getDateRange(data),
            uniqueAdvertisers,
            uniqueDomains,
            avgDuration: avgDuration.toFixed(1),
            topAdvertisers,
            topDomains: this.getTop(domainCounts, 10),
            monthlyDistribution: this.getMonthlyDistribution(data),
            seasonalPatterns: this.getSeasonalPatterns(data)
        };
    }

    private calculateCompetitorStats(competitorAds: AdData[], allData: AdData[]) {
        const totalDays = competitorAds.reduce((sum, ad) => sum + ad.totalDisplayDays, 0);
        const avgDuration = totalDays / competitorAds.length;
        
        const domainCounts = this.countBy(competitorAds, 'domain');
        const domains = Object.entries(domainCounts).map(([domain, count]) => ({ domain, count }));
        
        const marketShare = (competitorAds.length / allData.length * 100).toFixed(2);

        const durations = competitorAds.map(ad => ad.totalDisplayDays);
        const longestCampaign = Math.max(...durations);
        const shortestCampaign = Math.min(...durations);

        const timeline = this.getMonthlyDistribution(competitorAds);
        const mostActiveMonth = Object.entries(timeline).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        return {
            activePeriod: this.getDateRange(competitorAds),
            avgDuration: avgDuration.toFixed(1),
            totalDays,
            domains,
            marketShare,
            timeline,
            longestCampaign,
            shortestCampaign,
            mostActiveMonth
        };
    }

    private calculateBenchmarks(data: AdData[]) {
        const domainCounts = this.countBy(data, 'domain');
        const advertiserCounts = this.countBy(data, 'advertiserName');
        
        const totalAdvertisers = Object.keys(advertiserCounts).length;
        const totalDomains = Object.keys(domainCounts).length;
        const avgAdsPerAdvertiser = data.length / totalAdvertisers;

        const competitionLevel = data.length > 1000 ? 'High' : data.length > 500 ? 'Medium' : 'Low';
        const saturationLevel = avgAdsPerAdvertiser > 10 ? 'High' : avgAdsPerAdvertiser > 5 ? 'Medium' : 'Low';

        return {
            avgDuration: this.calculateAvgDuration(data),
            topDomains: Object.keys(domainCounts).slice(0, 10),
            peakMonths: this.getPeakMonths(data),
            competitionLevel,
            totalAdvertisers,
            totalDomains,
            avgAdsPerAdvertiser: avgAdsPerAdvertiser.toFixed(1),
            saturationLevel
        };
    }

    private calculateTrendData(data: AdData[]) {
        const monthly = this.getMonthlyDistribution(data);
        const sortedMonths = Object.keys(monthly).sort();
        
        const monthlyGrowth: Record<string, number> = {};
        for (let i = 1; i < sortedMonths.length; i++) {
            const prevMonth = sortedMonths[i - 1];
            const currentMonth = sortedMonths[i];
            const growth = ((monthly[currentMonth] - monthly[prevMonth]) / monthly[prevMonth] * 100).toFixed(1);
            monthlyGrowth[currentMonth] = parseFloat(growth);
        }

        const recentMonths = sortedMonths.slice(-3);
        const recentAds = data.filter(ad => {
            const month = ad.startDate.substring(0, 7);
            return recentMonths.includes(month);
        });
        
        const recentAdvertisers = this.countBy(recentAds, 'advertiserName');
        const emergingAdvertisers: EmergingAdvertiser[] = Object.entries(recentAdvertisers)
            .map(([name, count]) => ({
                name,
                adCount: count,
                domains: new Set(recentAds.filter(ad => ad.advertiserName === name).map(ad => ad.domain)).size
            }))
            .slice(0, 10);

        const firstMonthCount = monthly[sortedMonths[0]] || 0;
        const lastMonthCount = monthly[sortedMonths[sortedMonths.length - 1]] || 0;
        const overallGrowth = firstMonthCount > 0 
            ? ((lastMonthCount - firstMonthCount) / firstMonthCount * 100).toFixed(1)
            : '0';

        const decliningAdvertisers: DecliningAdvertiser[] = [];
        const domainTrends: Record<string, DomainTrend> = {};

        return {
            monthlyGrowth,
            emergingAdvertisers,
            decliningAdvertisers,
            domainTrends,
            seasonalInsights: this.getSeasonalPatterns(data),
            newAdvertisersRate: (emergingAdvertisers.length / 3).toFixed(1),
            churnRate: '0',
            overallGrowth
        };
    }

    private generateDataContext(data: AdData[]): string {
        const stats = this.calculateMarketStats(data);
        return `
Total Ads: ${data.length}
Date Range: ${stats.dateRange}
Advertisers: ${stats.uniqueAdvertisers}
Domains: ${stats.uniqueDomains}
Top Advertisers: ${stats.topAdvertisers.slice(0, 5).map(a => a.name).join(', ')}
Top Domains: ${stats.topDomains.slice(0, 5).map(d => d.name).join(', ')}
        `.trim();
    }

    private countBy(data: AdData[], field: keyof AdData): Record<string, number> {
        return data.reduce((acc, item) => {
            const key = String(item[field]);
            if (key) acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    private getTop(counts: Record<string, number>, limit: number) {
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, count]) => ({ name, count }));
    }

    private getDateRange(data: AdData[]): string {
        const dates = data.map(d => new Date(d.startDate).getTime()).filter(d => !isNaN(d));
        if (dates.length === 0) return 'N/A';
        const min = new Date(Math.min(...dates)).toISOString().split('T')[0];
        const max = new Date(Math.max(...dates)).toISOString().split('T')[0];
        return `${min} to ${max}`;
    }

    private getMonthlyDistribution(data: AdData[]): Record<string, number> {
        const monthly: Record<string, number> = {};
        data.forEach(ad => {
            const month = ad.startDate.substring(0, 7);
            monthly[month] = (monthly[month] || 0) + 1;
        });
        return monthly;
    }

    private getSeasonalPatterns(data: AdData[]) {
        const quarters: Record<string, number> = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
        data.forEach(ad => {
            const month = parseInt(ad.startDate.substring(5, 7));
            if (month <= 3) quarters.Q1++;
            else if (month <= 6) quarters.Q2++;
            else if (month <= 9) quarters.Q3++;
            else quarters.Q4++;
        });
        return quarters;
    }

    private calculateAvgDuration(data: AdData[]): number {
        const total = data.reduce((sum, ad) => sum + ad.totalDisplayDays, 0);
        return Math.round(total / data.length);
    }

    private getPeakMonths(data: AdData[]): string[] {
        const monthly = this.getMonthlyDistribution(data);
        return Object.entries(monthly)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([month]) => month);
    }

    private extractRecommendations(text: string): string[] {
        const lines = text.split('\n');
        const recommendations: string[] = [];
        
        let inRecommendationSection = false;
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.toLowerCase().includes('recommendation') || 
                trimmed.toLowerCase().includes('action') ||
                trimmed.toLowerCase().includes('should')) {
                inRecommendationSection = true;
            }
            
            if (/^[\d\-\*•]/.test(trimmed) && trimmed.length > 15) {
                const cleaned = trimmed.replace(/^[\d\-\*•\.\)]\s*/, '').trim();
                if (cleaned.length > 10) {
                    recommendations.push(cleaned);
                }
            }
        }
        
        return recommendations.slice(0, 10);
    }
}
