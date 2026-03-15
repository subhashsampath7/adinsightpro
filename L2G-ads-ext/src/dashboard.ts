import { storage } from './utils';
import { AdData } from './types';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { AIAnalyzer } from './ai-analyzer';
import { CONFIG } from './config';

// Global variables
let allData: AdData[] = [];
let filteredData: AdData[] = [];
let currentPage = 1;
const itemsPerPage = 20;
let aiAnalyzer: AIAnalyzer;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Dashboard loaded');
    
    // Initialize AI Analyzer with API key from config
    try {
        aiAnalyzer = new AIAnalyzer(CONFIG.OPENAI_API_KEY);
        console.log('✅ AI Analyzer initialized');
    } catch (error) {
        console.error('❌ Failed to initialize AI Analyzer:', error);
    }
    
    await loadData();
    setupEventListeners();
    setupAIModal();
});

// Load data from storage
async function loadData() {
    try {
        allData = await storage.get('dataList') as AdData[] || [];
        
        if (allData.length === 0) {
            document.getElementById('no-data-message')?.classList.remove('hidden');
            document.querySelector('.data-table-container table')?.classList.add('hidden');
            document.querySelector('.pagination')?.classList.add('hidden');
            document.querySelector('.data-visualization')?.classList.add('hidden');
            return;
        }

        // Update UI
        updateStats();
        populateFilters();
        filteredData = [...allData];
        displayData();
        renderCharts();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data from storage');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Export button
    document.getElementById('export-excel')?.addEventListener('click', exportToExcel);
    
    // Clear data button
    document.getElementById('clear-data')?.addEventListener('click', clearData);
    
    // Search
    document.getElementById('search-button')?.addEventListener('click', performSearch);
    document.getElementById('search-input')?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Filters
    document.getElementById('domain-filter')?.addEventListener('change', applyFilters);
    document.getElementById('advertiser-filter')?.addEventListener('change', applyFilters);
    document.getElementById('start-date-filter')?.addEventListener('change', applyFilters);
    document.getElementById('end-date-filter')?.addEventListener('change', applyFilters);
    
    // Pagination
    document.getElementById('prev-page')?.addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('next-page')?.addEventListener('click', () => changePage(currentPage + 1));
    
    // Go to Google Ads Transparency
    document.getElementById('go-to-google-ads')?.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://adstransparency.google.com' });
    });
}

// Setup AI Modal
function setupAIModal() {
    const aiBtn = document.getElementById('ai-analyze-btn');
    const modal = document.getElementById('ai-modal');
    const closeBtn = document.getElementById('close-modal');
    const analysisButtons = document.querySelectorAll('.analysis-btn');
    const runAnalysisBtn = document.getElementById('run-analysis-btn');

    // Open modal
    aiBtn?.addEventListener('click', () => {
        if (allData.length === 0) {
            showError('No data available. Please scrape some ads first.');
            return;
        }
        if (!aiAnalyzer) {
            showError('AI Analyzer not initialized. Please check your API key.');
            return;
        }
        modal!.style.display = 'flex';
    });

    // Close modal
    closeBtn?.addEventListener('click', () => {
        modal!.style.display = 'none';
        resetAIModal();
    });

    // Click outside to close
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetAIModal();
        }
    });

    // Analysis type selection
    analysisButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            analysisButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const type = btn.getAttribute('data-type');
            showAnalysisInputs(type!);
        });
    });

    // Run analysis
    runAnalysisBtn?.addEventListener('click', () => runAIAnalysis());
}

function showAnalysisInputs(type: string) {
    // Hide all input containers
    document.getElementById('competitor-select-container')!.style.display = 'none';
    document.getElementById('custom-question-container')!.style.display = 'none';
    document.getElementById('campaign-input-container')!.style.display = 'none';
    document.getElementById('run-analysis-btn')!.style.display = 'block';

    // Show relevant inputs
    if (type === 'competitor') {
        const container = document.getElementById('competitor-select-container')!;
        container.style.display = 'block';
        
        // Populate competitor dropdown
        const select = document.getElementById('competitor-select') as HTMLSelectElement;
        const advertisers = [...new Set(allData.map(ad => ad.advertiserName))].sort();
        select.innerHTML = advertisers.map(name => 
            `<option value="${name}">${name}</option>`
        ).join('');
    } else if (type === 'custom') {
        document.getElementById('custom-question-container')!.style.display = 'block';
    } else if (type === 'campaign' || type === 'roi') {
        document.getElementById('campaign-input-container')!.style.display = 'block';
    }
}

async function runAIAnalysis() {
    const activeBtn = document.querySelector('.analysis-btn.active');
    if (!activeBtn) {
        showError('Please select an analysis type');
        return;
    }

    const type = activeBtn.getAttribute('data-type')!;
    
    // Show loading
    document.getElementById('analysis-loading')!.style.display = 'block';
    document.getElementById('analysis-results')!.style.display = 'none';
    document.querySelector('.analysis-options')!.classList.add('hidden');
    document.getElementById('competitor-select-container')!.style.display = 'none';
    document.getElementById('custom-question-container')!.style.display = 'none';
    document.getElementById('campaign-input-container')!.style.display = 'none';
    document.getElementById('run-analysis-btn')!.style.display = 'none';

    try {
        let result;
        const dataToAnalyze = filteredData.length > 0 ? filteredData : allData;

        switch (type) {
            case 'market':
                result = await aiAnalyzer.analyzeMarket(dataToAnalyze);
                break;
            
            case 'competitor':
                const competitorName = (document.getElementById('competitor-select') as HTMLSelectElement).value;
                result = await aiAnalyzer.analyzeCompetitor(competitorName, allData);
                break;
            
            case 'campaign':
                const campaignData = {
                    domain: (document.getElementById('campaign-domain') as HTMLInputElement).value,
                    duration: parseInt((document.getElementById('campaign-duration') as HTMLInputElement).value),
                    budget: (document.getElementById('campaign-budget') as HTMLSelectElement).value
                };
                result = await aiAnalyzer.optimizeCampaign(campaignData, allData);
                break;

            case 'roi':
                const roiCampaignData = {
                    domain: (document.getElementById('campaign-domain') as HTMLInputElement).value,
                    duration: parseInt((document.getElementById('campaign-duration') as HTMLInputElement).value),
                    budget: (document.getElementById('campaign-budget') as HTMLSelectElement).value
                };
                result = await aiAnalyzer.estimateROI(roiCampaignData, allData);
                break;
            
            case 'trends':
                result = await aiAnalyzer.predictTrends(allData);
                break;
            
            case 'custom':
                const question = (document.getElementById('custom-question') as HTMLTextAreaElement).value.trim();
                if (!question) {
                    showError('Please enter a question');
                    resetAIModal();
                    return;
                }
                result = await aiAnalyzer.askCustomQuestion(question, allData);
                break;
            
            default:
                throw new Error('Unknown analysis type');
        }

        displayAnalysisResults(result);
    } catch (error) {
        console.error('Analysis error:', error);
        showError('Analysis failed: ' + (error as Error).message);
        resetAIModal();
    } finally {
        document.getElementById('analysis-loading')!.style.display = 'none';
    }
}

function displayAnalysisResults(result: any) {
    document.getElementById('analysis-results')!.style.display = 'block';
    document.getElementById('analysis-title')!.textContent = result.title;
    
    // Format insights with markdown-style rendering
    const formattedInsights = result.insights
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/###\s+(.*?)(\n|$)/g, '<h3>$1</h3>')
        .replace(/##\s+(.*?)(\n|$)/g, '<h2>$1</h2>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    document.getElementById('analysis-content')!.innerHTML = `<p>${formattedInsights}</p>`;
    
    // Display recommendations
    if (result.recommendations && result.recommendations.length > 0) {
        const recsHTML = `
            <h3><i class="fas fa-lightbulb"></i> Key Recommendations</h3>
            <ul class="recommendations-list">
                ${result.recommendations.map((rec: string) => `<li><i class="fas fa-check-circle"></i> ${rec}</li>`).join('')}
            </ul>
        `;
        document.getElementById('analysis-recommendations')!.innerHTML = recsHTML;
    }

    // Setup export button
    const exportBtn = document.getElementById('export-analysis-btn');
    if (exportBtn) {
        // Remove old listeners
        const newExportBtn = exportBtn.cloneNode(true);
        exportBtn.parentNode?.replaceChild(newExportBtn, exportBtn);
        
        newExportBtn.addEventListener('click', () => {
            exportAnalysisReport(result);
        });
    }
}

function exportAnalysisReport(result: any) {
    const reportContent = `
╔════════════════════════════════════════════════════════════╗
║          L2G ADS - AI ANALYSIS REPORT                      ║
╚════════════════════════════════════════════════════════════╝

Generated: ${new Date(result.timestamp).toLocaleString()}
Analysis Type: ${result.type}

${result.title}
${'='.repeat(result.title.length)}

${result.insights}

╔════════════════════════════════════════════════════════════╗
║                  KEY RECOMMENDATIONS                        ║
╚════════════════════════════════════════════════════════════╝

${result.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n\n')}

╔════════════════════════════════════════════════════════════╗
║                    ANALYSIS DATA                            ║
╚════════════════════════════════════════════════════════════╝

Total Ads Analyzed: ${allData.length}
Filtered Data: ${filteredData.length > 0 ? filteredData.length : 'N/A'}

---
Report generated by L2G ADS AI Analyzer
Powered by OpenAI GPT-4
© 2025 L2G ADS
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `L2G_AI_Analysis_${result.type}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccess('Analysis report exported successfully!');
}

function resetAIModal() {
    document.querySelector('.analysis-options')!.classList.remove('hidden');
    document.getElementById('analysis-results')!.style.display = 'none';
    document.getElementById('analysis-loading')!.style.display = 'none';
    document.getElementById('run-analysis-btn')!.style.display = 'none';
    document.getElementById('competitor-select-container')!.style.display = 'none';
    document.getElementById('custom-question-container')!.style.display = 'none';
    document.getElementById('campaign-input-container')!.style.display = 'none';
    document.querySelectorAll('.analysis-btn').forEach(btn => btn.classList.remove('active'));
    
    // Reset inputs
    (document.getElementById('custom-question') as HTMLTextAreaElement).value = '';
    (document.getElementById('campaign-domain') as HTMLInputElement).value = '';
    (document.getElementById('campaign-duration') as HTMLInputElement).value = '30';
}

// Update dashboard statistics
function updateStats() {
    if (allData.length === 0) return;
    
    // Total ads
    document.getElementById('total-ads')!.textContent = allData.length.toString();
    
    // Total advertisers
    const uniqueAdvertisers = new Set(allData.map(ad => ad.advertiserName)).size;
    const advertiserElement = document.getElementById('total-advertisers');
    if (advertiserElement) {
        advertiserElement.textContent = uniqueAdvertisers.toString();
    }
    
    // Total domains
    const uniqueDomains = new Set(allData.map(ad => ad.domain).filter(Boolean)).size;
    const domainElement = document.getElementById('total-domains');
    if (domainElement) {
        domainElement.textContent = uniqueDomains.toString();
    }
    
    // Date range
    const startDates = allData.map(item => new Date(item.startDate).getTime()).filter(date => !isNaN(date));
    const endDates = allData.map(item => new Date(item.endDate).getTime()).filter(date => !isNaN(date));
    
    if (startDates.length > 0 && endDates.length > 0) {
        const earliestDate = new Date(Math.min(...startDates));
        const latestDate = new Date(Math.max(...endDates));
        
        const formatDate = (date: Date) => {
            return date.toISOString().split('T')[0];
        };
        
        document.getElementById('date-range')!.textContent = `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;
        
        // Set the min/max attributes for date filters
        const startDateFilter = document.getElementById('start-date-filter') as HTMLInputElement;
        const endDateFilter = document.getElementById('end-date-filter') as HTMLInputElement;
        
        if (startDateFilter && endDateFilter) {
            startDateFilter.min = formatDate(earliestDate);
            startDateFilter.max = formatDate(latestDate);
            endDateFilter.min = formatDate(earliestDate);
            endDateFilter.max = formatDate(latestDate);
        }
    }
}

// Populate filter dropdowns
function populateFilters() {
    if (allData.length === 0) return;
    
    // Domain filter
    const domainFilter = document.getElementById('domain-filter') as HTMLSelectElement;
    const domains = [...new Set(allData.map(item => item.domain).filter(Boolean))];
    domains.sort();
    
    domainFilter.innerHTML = '<option value="">All Domains</option>';
    domains.forEach(domain => {
        const option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        domainFilter.appendChild(option);
    });
    
    // Advertiser filter
    const advertiserFilter = document.getElementById('advertiser-filter') as HTMLSelectElement;
    const advertisers = [...new Set(allData.map(item => item.advertiserName))];
    advertisers.sort();
    
    advertiserFilter.innerHTML = '<option value="">All Advertisers</option>';
    advertisers.forEach(advertiser => {
        const option = document.createElement('option');
        option.value = advertiser;
        option.textContent = advertiser;
        advertiserFilter.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const domainFilter = (document.getElementById('domain-filter') as HTMLSelectElement).value;
    const advertiserFilter = (document.getElementById('advertiser-filter') as HTMLSelectElement).value;
    const startDateFilter = (document.getElementById('start-date-filter') as HTMLInputElement).value;
    const endDateFilter = (document.getElementById('end-date-filter') as HTMLInputElement).value;
    
    filteredData = allData.filter(item => {
        // Domain filter
        if (domainFilter && item.domain !== domainFilter) return false;
        
        // Advertiser filter
        if (advertiserFilter && item.advertiserName !== advertiserFilter) return false;
        
        // Date range filter
        if (startDateFilter || endDateFilter) {
            const itemStartDate = new Date(item.startDate);
            const itemEndDate = new Date(item.endDate);
            
            if (startDateFilter) {
                const filterStartDate = new Date(startDateFilter);
                if (itemEndDate < filterStartDate) return false;
            }
            
            if (endDateFilter) {
                const filterEndDate = new Date(endDateFilter);
                if (itemStartDate > filterEndDate) return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1;
    displayData();
    renderCharts();
}

// Perform search (updated to include spending and time shown)
function performSearch() {
    const searchTerm = (document.getElementById('search-input') as HTMLInputElement).value.toLowerCase();
    
    if (!searchTerm.trim()) {
        filteredData = [...allData];
    } else {
        filteredData = allData.filter(item => {
            return (
                item.advertiserId.toLowerCase().includes(searchTerm) ||
                item.advertiserName.toLowerCase().includes(searchTerm) ||
                item.domain.toLowerCase().includes(searchTerm) ||
                item.urlDetail.toLowerCase().includes(searchTerm) ||
                (item.spendRange && item.spendRange.toLowerCase().includes(searchTerm)) ||
                (item.shownRange && item.shownRange.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    currentPage = 1;
    displayData();
    renderCharts();
}

// Display data in table (updated with spending and time shown columns)
function displayData() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Update table
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="9" class="no-data">No matching data found</td>';
        tableBody.appendChild(row);
    } else {
        pageData.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.advertiserId}</td>
                <td>${item.advertiserName}</td>
                <td><a href="${item.urlDetail}" target="_blank" title="${item.urlDetail}">${truncateText(item.urlDetail, 30)}</a></td>
                <td>${item.startDate}</td>
                <td>${item.endDate}</td>
                <td>${item.totalDisplayDays}</td>
                <td class="spend-range">${item.spendRange || 'N/A'}</td>
                <td class="time-shown">${item.shownRange || 'N/A'}</td>
                <td>${item.domain || 'N/A'}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Update pagination controls
    updatePagination(totalPages);
}

// Update pagination controls
function updatePagination(totalPages: number) {
    const prevButton = document.getElementById('prev-page') as HTMLButtonElement;
    const nextButton = document.getElementById('next-page') as HTMLButtonElement;
    const pageInfo = document.getElementById('page-info');
    
    if (prevButton) prevButton.disabled = currentPage <= 1;
    if (nextButton) nextButton.disabled = currentPage >= totalPages;
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
}

// Change page
function changePage(page: number) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayData();
}

// Export data to Excel (updated with all fields)
function exportToExcel() {
    try {
        // Prepare data for Excel
        const workbookData = filteredData.map(item => ({
            'Advertiser ID': item.advertiserId,
            'Advertiser Name': item.advertiserName,
            'URL Detail': item.urlDetail,
            'Start Date': item.startDate,
            'End Date': item.endDate,
            'Total Display Days': item.totalDisplayDays,
            'Spend Range': item.spendRange || 'N/A',
            'Min Spend': item.minSpend || '',
            'Max Spend': item.maxSpend || '',
            'Currency': item.currency || '',
            'Time Shown Range': item.shownRange || 'N/A',
            'Min Time Shown': item.minShownRange || '',
            'Max Time Shown': item.maxShownRange || '',
            'Domain': item.domain,
            'Image URL': item.imageUrl
        }));
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(workbookData);
        
        // Create workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Google Ads Data');
        
        // Apply column widths for better readability
        const columnWidths = [
            { wch: 15 }, // Advertiser ID
            { wch: 30 }, // Advertiser Name
            { wch: 50 }, // URL Detail
            { wch: 12 }, // Start Date
            { wch: 12 }, // End Date
            { wch: 18 }, // Total Display Days
            { wch: 20 }, // Spend Range
            { wch: 12 }, // Min Spend
            { wch: 12 }, // Max Spend
            { wch: 10 }, // Currency
            { wch: 20 }, // Time Shown Range
            { wch: 15 }, // Min Time Shown
            { wch: 15 }, // Max Time Shown
            { wch: 20 }, // Domain
            { wch: 50 }  // Image URL
        ];
        worksheet['!cols'] = columnWidths;
        
        // Generate Excel file
        XLSX.writeFile(workbook, `google_ads_data_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        showSuccess('Data exported successfully as Excel file');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showError('Failed to export data to Excel');
    }
}

// Render charts
function renderCharts() {
    if (filteredData.length === 0) return;
    
    renderDomainChart();
    renderTimelineChart();
}

// Render domain chart
function renderDomainChart() {
    const canvas = document.getElementById('domains-chart') as HTMLCanvasElement;
    if (!canvas) return;
    
    // Count domains
    const domainCounts: Record<string, number> = {};
    filteredData.forEach(item => {
        if (item.domain) {
            domainCounts[item.domain] = (domainCounts[item.domain] || 0) + 1;
        }
    });
    
    // Sort and limit to top 10
    const sortedDomains = Object.entries(domainCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = sortedDomains.map(([domain]) => domain);
    const data = sortedDomains.map(([, count]) => count);
    
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }
    
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Number of Ads',
                data,
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Ads'
                    }
                }
            }
        }
    });
}

// Render timeline chart
function renderTimelineChart() {
    const canvas = document.getElementById('timeline-chart') as HTMLCanvasElement;
    if (!canvas) return;
    
    // Group by month
    const monthlyData: Record<string, number> = {};
    
    filteredData.forEach(item => {
        if (item.startDate) {
            const date = new Date(item.startDate);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
        }
    });
    
    // Sort chronologically
    const sortedMonths = Object.keys(monthlyData).sort();
    const data = sortedMonths.map(month => monthlyData[month]);
    
    // Format labels
    const labels = sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return `${monthNum}/${year}`;
    });
    
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }
    
    new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Ads Started',
                data,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Ads'
                    }
                }
            }
        }
    });
}

// Clear all data
async function clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        try {
            await storage.set('dataList', []);
            allData = [];
            filteredData = [];
            
            // Update UI
            document.getElementById('no-data-message')?.classList.remove('hidden');
            document.querySelector('.data-table-container table')?.classList.add('hidden');
            document.querySelector('.pagination')?.classList.add('hidden');
            document.querySelector('.data-visualization')?.classList.add('hidden');
            
            updateStats();
            
            showSuccess('All data cleared successfully');
        } catch (error) {
            console.error('Error clearing data:', error);
            showError('Failed to clear data');
        }
    }
}

// Helper: Truncate text
function truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Helper: Show success message
function showSuccess(message: string) {
    showToast(message, 'success');
}

// Helper: Show error message
function showError(message: string) {
    showToast(message, 'error');
}

// Toast notification system
function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for dashboard
const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .hidden {
            display: none !important;
        }
        
        .date-range-filter .date-inputs {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .date-range-filter input[type="date"] {
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        
        /* Spend Range Column Styling */
        .spend-range {
            font-weight: 600;
            color: #4CAF50;
            white-space: nowrap;
        }
        
        td.spend-range {
            background: linear-gradient(90deg, rgba(76, 175, 80, 0.05) 0%, transparent 100%);
        }
        
        /* Time Shown Column Styling */
        .time-shown {
            font-weight: 600;
            color: #2196F3;
            white-space: nowrap;
        }
        
        td.time-shown {
            background: linear-gradient(90deg, rgba(33, 150, 243, 0.05) 0%, transparent 100%);
        }
        
        /* Toast Notifications */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .toast-success {
            border-left: 4px solid #4CAF50;
        }
        
        .toast-success i {
            color: #4CAF50;
        }
        
        .toast-error {
            border-left: 4px solid #f44336;
        }
        
        .toast-error i {
            color: #f44336;
        }
        
        .toast-info {
            border-left: 4px solid #2196F3;
        }
        
        .toast-info i {
            color: #2196F3;
        }
        
        .toast i {
            font-size: 20px;
        }
        
        .toast span {
            font-size: 14px;
            color: #333;
        }
    `;
    document.head.appendChild(style);
};

addStyles();
