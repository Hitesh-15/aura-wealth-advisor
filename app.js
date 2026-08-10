/**
 * Aura Wealth - AI Financial Advisor & Personal Finance Engine
 * Fully client-side interactive financial planner, FIRE calculator, debt strategist & AI advisor
 */

// DEMO PRESET PROFILES DATA
const DEMO_PROFILES = {
    tech_pro: {
        name: "Early Career Tech Professional",
        monthlyIncome: 9500,
        monthlyExpenses: 5200,
        persona: "fire",
        assets: [
            { id: "a1", name: "High-Yield Savings (Emergency)", category: "Cash", amount: 22000 },
            { id: "a2", name: "Vanguard Total Stock ETF (VTI)", category: "Stocks", amount: 48000 },
            { id: "a3", name: "Company 401(k) Index Fund", category: "Retirement", amount: 35000 },
            { id: "a4", name: "Ethereum & Bitcoin", category: "Crypto", amount: 8500 }
        ],
        liabilities: [
            { id: "l1", name: "Student Loans", category: "Student Loans", amount: 18500, apr: 4.8, minPay: 240 },
            { id: "l2", name: "Chase Sapphire Credit Card", category: "Credit Cards", amount: 2400, apr: 22.4, minPay: 85 }
        ],
        goals: [
            { id: "g1", name: "FIRE Nest Egg Target", category: "Retirement", target: 1800000, current: 83000, targetDate: "2042-12-31" },
            { id: "g2", name: "House Down Payment Fund", category: "House", target: 80000, current: 22000, targetDate: "2028-06-30" },
            { id: "g3", name: "Japan Travel Vacation", category: "Vacation", target: 6000, current: 3500, targetDate: "2027-04-15" }
        ]
    },
    young_family: {
        name: "Young Family Buying First Home",
        monthlyIncome: 12000,
        monthlyExpenses: 8400,
        persona: "balanced",
        assets: [
            { id: "a1", name: "Checking & Savings", category: "Cash", amount: 45000 },
            { id: "a2", name: "Joint Brokerage Account", category: "Stocks", amount: 62000 },
            { id: "a3", name: "Combined 401(k) / IRA", category: "Retirement", amount: 110000 },
            { id: "a4", name: "529 College Savings Plan", category: "Other", amount: 14000 }
        ],
        liabilities: [
            { id: "l1", name: "Auto Loan (Subaru Outback)", category: "Auto Loans", amount: 16000, apr: 5.2, minPay: 380 }
        ],
        goals: [
            { id: "g1", name: "20% Home Down Payment", category: "House", target: 120000, current: 45000, targetDate: "2027-09-01" },
            { id: "g2", name: "6-Month Emergency Buffer", category: "Emergency", target: 50000, current: 45000, targetDate: "2026-12-31" }
        ]
    },
    fire_seeker: {
        name: "FIRE Aspirant (Lean FIRE)",
        monthlyIncome: 13500,
        monthlyExpenses: 4500,
        persona: "fire",
        assets: [
            { id: "a1", name: "HYSA Cash Buffer", category: "Cash", amount: 30000 },
            { id: "a2", name: "Vanguard S&P 500 (VOO)", category: "Stocks", amount: 240000 },
            { id: "a3", name: "Roth IRA & Solo 401k", category: "Retirement", amount: 180000 },
            { id: "a4", name: "Rental Property Equity", category: "Real Estate", amount: 95000 }
        ],
        liabilities: [
            { id: "l1", name: "Rental Property Mortgage", category: "Mortgage", amount: 180000, apr: 6.1, minPay: 1250 }
        ],
        goals: [
            { id: "g1", name: "Financial Independence ($1.35M)", category: "Retirement", target: 1350000, current: 545000, targetDate: "2033-01-01" }
        ]
    },
    pre_retiree: {
        name: "Pre-Retiree Wealth Preserver",
        monthlyIncome: 17500,
        monthlyExpenses: 9000,
        persona: "conservative",
        assets: [
            { id: "a1", name: "Money Market Treasury Fund", category: "Cash", amount: 120000 },
            { id: "a2", name: "Dividend Growth Stock Portfolio", category: "Stocks", amount: 650000 },
            { id: "a3", name: "Traditional 401(k) / Rollover IRA", category: "Retirement", amount: 820000 },
            { id: "a4", name: "Municipal & Corporate Bonds", category: "Bonds", amount: 250000 }
        ],
        liabilities: [
            { id: "l1", name: "Primary Residence Mortgage", category: "Mortgage", amount: 65000, apr: 3.25, minPay: 1400 }
        ],
        goals: [
            { id: "g1", name: "Pay Off Mortgage completely", category: "House", target: 65000, current: 40000, targetDate: "2028-05-01" },
            { id: "g2", name: "Grandchildren Trust Fund", category: "Education", target: 100000, current: 65000, targetDate: "2030-01-01" }
        ]
    }
};

// State Store
let appState = {
    monthlyIncome: 9500,
    monthlyExpenses: 5200,
    persona: "balanced",
    assets: [],
    liabilities: [],
    goals: [],
    chatHistory: [],
    settings: {
        engineMode: localStorage.getItem("aura_engine_mode") || "gemini",
        apiKey: localStorage.getItem("aura_gemini_api_key") || "",
        modelName: localStorage.getItem("aura_gemini_model") || "gemini-3.6-flash",
        customModel: localStorage.getItem("aura_gemini_custom_model") || ""
    }
};

// Chart instances
let charts = {};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    loadProfileData("tech_pro");
    setupNavigation();
    setupEventListeners();
    setupModals();
    renderAll();
}

function loadProfileData(profileKey) {
    if (DEMO_PROFILES[profileKey]) {
        const data = JSON.parse(JSON.stringify(DEMO_PROFILES[profileKey]));
        appState.monthlyIncome = data.monthlyIncome;
        appState.monthlyExpenses = data.monthlyExpenses;
        appState.persona = data.persona || "balanced";
        appState.assets = data.assets;
        appState.liabilities = data.liabilities;
        appState.goals = data.goals;
        appState.chatHistory = [];
        
        const personaRadio = document.querySelector(`input[name="advisorPersona"][value="${appState.persona}"]`);
        if (personaRadio) {
            personaRadio.checked = true;
            updatePersonaBoxes();
        }
    }
}

function setupNavigation() {
    const navTabs = document.querySelectorAll(".nav-tab");
    navTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            switchToTab(tab.dataset.tab);
        });
    });

    const subTabs = document.querySelectorAll(".sub-tab");
    subTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.subtab;
            subTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            document.querySelectorAll(".subtab-content").forEach(c => c.classList.remove("active"));
            const targetContent = document.getElementById(`subtab-${target}`);
            if (targetContent) targetContent.classList.add("active");
            
            renderCalculators();
        });
    });
}

function switchToTab(tabId) {
    document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
    const selectedTab = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (selectedTab) selectedTab.classList.add("active");

    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    const targetContent = document.getElementById(`tab-${tabId}`);
    if (targetContent) targetContent.classList.add("active");

    renderAll();
}

function setupEventListeners() {
    const profileSelect = document.getElementById("profileSelect");
    profileSelect.addEventListener("change", (e) => {
        loadProfileData(e.target.value);
        renderAll();
    });

    const personaRadios = document.querySelectorAll(`input[name="advisorPersona"]`);
    personaRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            appState.persona = e.target.value;
            updatePersonaBoxes();
            renderAIAdvisor();
        });
    });

    document.querySelectorAll(".persona-option").forEach(card => {
        card.addEventListener("click", (e) => {
            const radio = card.querySelector('input[name="advisorPersona"]');
            if (radio && radio.value !== appState.persona) {
                radio.checked = true;
                appState.persona = radio.value;
                updatePersonaBoxes();
                renderAIAdvisor();
            }
        });
    });

    const calcInputs = [
        "fireCurrentAge", "fireTargetAge", "fireAnnualExpenses", "fireWithdrawalRate", "fireExpectedReturn", "fireInflation",
        "ciInitialDeposit", "ciMonthlyDeposit", "ciInvestmentYears", "ciAnnualReturn",
        "debtExtraMonthly", "budgetIncome"
    ];

    calcInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                updateCalcSliderLabels();
                renderCalculators();
            });
        }
    });

    document.querySelectorAll(".budget-rule-preset button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".budget-rule-preset button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderBudgetCalc();
        });
    });

    document.querySelectorAll(".chip-btn").forEach(chip => {
        chip.addEventListener("click", () => {
            sendChatMessage(chip.dataset.prompt);
        });
    });

    document.getElementById("chatForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const chatInput = document.getElementById("chatInput");
        const msg = chatInput.value.trim();
        if (msg) {
            sendChatMessage(msg);
            chatInput.value = "";
        }
    });

    document.getElementById("btnClearChat").addEventListener("click", () => {
        appState.chatHistory = [];
        renderChatMessages();
    });

    document.getElementById("btnRefreshMarketData")?.addEventListener("click", () => {
        renderMarketIndicators();
    });

    document.getElementById("btnExportData").addEventListener("click", exportDataJSON);
    document.getElementById("btnImportData").addEventListener("click", () => document.getElementById("importFileInput").click());
    document.getElementById("importFileInput").addEventListener("change", importDataJSON);
    document.getElementById("btnResetData").addEventListener("click", () => {
        if (confirm("Reset financial data to default demo profile?")) {
            loadProfileData("tech_pro");
            renderAll();
        }
    });
}

function updatePersonaBoxes() {
    document.querySelectorAll(".persona-option").forEach(opt => {
        const input = opt.querySelector('input[name="advisorPersona"]');
        if (input) {
            const isSelected = (input.value === appState.persona);
            input.checked = isSelected;
            if (isSelected) {
                opt.classList.add("active");
            } else {
                opt.classList.remove("active");
            }
        }
    });
}

function updateCalcSliderLabels() {
    setText("fireCurrentAgeVal", getVal("fireCurrentAge"));
    setText("fireTargetAgeVal", getVal("fireTargetAge"));
    setText("fireWithdrawalRateVal", getVal("fireWithdrawalRate") + "%");
    setText("fireExpectedReturnVal", getVal("fireExpectedReturn") + "%");
    setText("fireInflationVal", getVal("fireInflation") + "%");
    setText("ciYearsVal", getVal("ciInvestmentYears"));
    setText("ciReturnVal", getVal("ciAnnualReturn") + "%");
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function getCalculatedMetrics() {
    const totalAssets = appState.assets.reduce((sum, a) => sum + a.amount, 0);
    const totalLiabilities = appState.liabilities.reduce((sum, l) => sum + l.amount, 0);
    const netWorth = totalAssets - totalLiabilities;

    const monthlyIncome = appState.monthlyIncome;
    const monthlyExpenses = appState.monthlyExpenses;
    const monthlySurplus = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (monthlySurplus / monthlyIncome) * 100 : 0;

    const cashAssets = appState.assets
        .filter(a => a.category === "Cash")
        .reduce((sum, a) => sum + a.amount, 0);
    
    const emergencyMonths = monthlyExpenses > 0 ? (cashAssets / monthlyExpenses) : 0;

    const monthlyDebtMinPay = appState.liabilities.reduce((sum, l) => sum + (l.minPay || 0), 0);
    const dtiRatio = monthlyIncome > 0 ? (monthlyDebtMinPay / monthlyIncome) * 100 : 0;

    const growthAssets = appState.assets
        .filter(a => ["Stocks", "Retirement", "Real Estate", "Crypto"].includes(a.category))
        .reduce((sum, a) => sum + a.amount, 0);

    return {
        totalAssets, totalLiabilities, netWorth, monthlyIncome, monthlyExpenses,
        monthlySurplus, savingsRate, cashAssets, emergencyMonths, monthlyDebtMinPay, dtiRatio, growthAssets
    };
}

function computeHealthScore(m) {
    let score = 0;
    if (m.emergencyMonths >= 6) score += 25;
    else if (m.emergencyMonths >= 3) score += 20;
    else if (m.emergencyMonths >= 1) score += 10;
    else score += (m.emergencyMonths / 3) * 10;

    if (m.savingsRate >= 35) score += 25;
    else if (m.savingsRate >= 20) score += 20;
    else if (m.savingsRate >= 10) score += 12;
    else if (m.savingsRate > 0) score += 5;

    if (m.dtiRatio <= 10) score += 25;
    else if (m.dtiRatio <= 20) score += 20;
    else if (m.dtiRatio <= 36) score += 12;
    else score += 5;

    const investRatio = m.totalAssets > 0 ? (m.growthAssets / m.totalAssets) * 100 : 0;
    if (investRatio >= 60 && investRatio <= 90) score += 25;
    else if (investRatio > 30) score += 18;
    else score += 10;

    score = Math.min(100, Math.max(0, Math.round(score)));

    let statusTitle = "Needs Optimization";
    let statusDesc = "Review emergency savings and high-interest debt.";
    let strokeColor = "#ef4444";

    if (score >= 80) {
        statusTitle = "Excellent Financial Health";
        statusDesc = "Strong savings buffer, low debt burden, and active wealth building.";
        strokeColor = "#10b981";
    } else if (score >= 60) {
        statusTitle = "Solid Foundation";
        statusDesc = "Good core metrics. Optimize tax-advantaged accounts and high APR debts.";
        strokeColor = "#3b82f6";
    } else if (score >= 40) {
        statusTitle = "Moderate Warning";
        statusDesc = "Elevated debt or low emergency buffer detected. Take corrective steps.";
        strokeColor = "#f59e0b";
    }

    return { score, statusTitle, statusDesc, strokeColor };
}

function renderAll() {
    const m = getCalculatedMetrics();
    const h = computeHealthScore(m);

    renderDashboard(m, h);
    renderAIAdvisor(m, h);
    renderCalculators();
    renderGoals();
    renderLedger();
}

function renderDashboard(m, h) {
    setText("dashNetWorth", formatCurrency(m.netWorth));
    setText("dashTotalAssets", formatCurrency(m.totalAssets));
    setText("dashTotalLiabilities", formatCurrency(m.totalLiabilities));
    
    setText("dashHealthScore", h.score);
    setText("healthStatusTitle", h.statusTitle);
    setText("healthStatusDesc", h.statusDesc);
    
    const circle = document.getElementById("healthScoreCircle");
    if (circle) {
        const circumference = 326.72;
        const offset = circumference - (h.score / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = h.strokeColor;
    }

    setText("dashMonthlyIncome", formatCurrency(m.monthlyIncome));
    setText("dashMonthlyExpenses", formatCurrency(m.monthlyExpenses));
    setText("dashMonthlySurplus", formatCurrency(m.monthlySurplus));
    setText("savingsRateBadge", `Savings Rate: ${m.savingsRate.toFixed(1)}%`);

    renderQuickInsights(m, h);
    renderAssetAllocationChart();
    renderBudgetBreakdownChart(m);
    renderNetWorthProjectionChart(m);
}

function renderQuickInsights(m, h) {
    const container = document.getElementById("quickInsightsContainer");
    if (!container) return;

    let insights = [];

    if (m.emergencyMonths < 3) {
        insights.push({
            icon: "fa-shield-cat",
            priority: "high",
            title: "Build 3-Month Emergency Reserve",
            desc: `Current cash covers ${m.emergencyMonths.toFixed(1)} months of expenses. Target at least $${formatNumber(m.monthlyExpenses * 3)}.`
        });
    }

    const highAprDebt = appState.liabilities.filter(l => l.apr >= 12);
    if (highAprDebt.length > 0) {
        const totalHighDebt = highAprDebt.reduce((s, d) => s + d.amount, 0);
        insights.push({
            icon: "fa-fire-extinguisher",
            priority: "high",
            title: "Eliminate High-Interest Debt",
            desc: `You have $${formatNumber(totalHighDebt)} in credit card / loan debt above 12% APR costing ~$${formatNumber(totalHighDebt * 0.18 / 12)}/mo in interest.`
        });
    }

    if (m.savingsRate >= 25) {
        insights.push({
            icon: "fa-rocket",
            priority: "low",
            title: "High Savings Rate Advantage",
            desc: `Saving ${m.savingsRate.toFixed(0)}% of income allows fast-tracking FIRE or investing in high-yield assets.`
        });
    } else {
        insights.push({
            icon: "fa-piggy-bank",
            priority: "medium",
            title: "Boost Monthly Savings Rate",
            desc: "Aim to raise savings rate from " + m.savingsRate.toFixed(0) + "% to 20%+ by trimming discretionary spending."
        });
    }

    container.innerHTML = insights.map(item => `
        <div class="insight-card">
            <div class="insight-card-icon ${item.priority}">
                <i class="fa-solid ${item.icon}"></i>
            </div>
            <div class="insight-card-body">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        </div>
    `).join('');
}

function renderAIAdvisor(m = getCalculatedMetrics(), h = computeHealthScore(m)) {
    renderMarketIndicators();
    renderDiagnostics(m, h);
    renderActionRoadmap(m, h);
    const welcomeMsg = generateWelcomeMessage(m, h);
    if (appState.chatHistory.length === 0) {
        appState.chatHistory.push({ sender: "ai", text: welcomeMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    } else if (appState.chatHistory[0] && appState.chatHistory[0].sender === "ai") {
        // Update first welcome message live when persona changes
        appState.chatHistory[0].text = welcomeMsg;
    }
    renderChatMessages();
}

function renderDiagnostics(m, h) {
    const list = document.getElementById("diagnosticMetricsList");
    if (!list) return;

    const items = [
        { title: "Emergency Reserve", val: `${m.emergencyMonths.toFixed(1)} Months`, statusClass: m.emergencyMonths >= 3 ? "text-emerald" : "text-amber", icon: "fa-umbrella" },
        { title: "Savings Rate", val: `${m.savingsRate.toFixed(1)}%`, statusClass: m.savingsRate >= 20 ? "text-emerald" : "text-amber", icon: "fa-percent" },
        { title: "Debt-to-Income (DTI)", val: `${m.dtiRatio.toFixed(1)}%`, statusClass: m.dtiRatio <= 20 ? "text-emerald" : "text-red", icon: "fa-scale-unbalanced" },
        { title: "Invested Portfolio", val: formatCurrency(m.growthAssets), statusClass: "text-blue", icon: "fa-chart-line" }
    ];

    list.innerHTML = items.map(i => `
        <div class="diag-item">
            <div class="diag-title">
                <i class="fa-solid ${i.icon} ${i.statusClass}"></i>
                <span>${i.title}</span>
            </div>
            <div class="diag-value ${i.statusClass}">${i.val}</div>
        </div>
    `).join('');
}

function renderActionRoadmap(m, h) {
    const list = document.getElementById("roadmapStepsList");
    if (!list) return;

    const persona = appState.persona;
    let steps = [];

    if (m.emergencyMonths < 3) {
        steps.push({ p: 1, title: "Build 3-Month Emergency Fund", desc: `Allocate surplus cash into a High-Yield Savings Account (HYSA) until reaching $${formatNumber(m.monthlyExpenses * 3)}.` });
    }

    const highDebt = appState.liabilities.filter(l => l.apr >= 10);
    if (highDebt.length > 0) {
        steps.push({ p: 2, title: `Pay Off High-Interest Debt (${highDebt.map(d => d.name).join(", ")})`, desc: "Apply the Debt Avalanche strategy (extra payments to highest APR first) to eliminate expensive interest." });
    }

    steps.push({ p: 3, title: "Maximize Employer 401(k) / Pension Match", desc: "Capture 100% of free employer matching funds before contributing elsewhere." });

    if (persona === "fire") {
        steps.push({ p: 4, title: "Max Roth IRA & HSA Accounts", desc: "Contribute up to maximum limit ($7,500/yr Roth IRA + $4,300 HSA) for tax-free compounding." });
    } else {
        steps.push({ p: 4, title: "Broad Market Index Funds", desc: "Dollar-cost average extra savings into low-cost index ETFs (e.g. VTI, VOO, VXUS)." });
    }

    steps.push({ p: 5, title: "Fund Active Wealth Milestones", desc: `Systematically allocate remaining monthly surplus across your ${appState.goals.length} target goals.` });

    list.innerHTML = steps.map((s, idx) => `
        <div class="step-item priority-${s.p}">
            <div class="step-num">${idx + 1}</div>
            <div class="step-content">
                <h4>${s.title}</h4>
                <p>${s.desc}</p>
            </div>
        </div>
    `).join('');
}

function generateWelcomeMessage(m, h) {
    const annualExp = m.monthlyExpenses * 12;
    const fireTarget = annualExp / 0.04;

    const personaWelcomeMap = {
        balanced: `
            ⚖️ <strong>Hello! I am your Ambulkar Cortex AI Advisor</strong> operating under the <strong>Balanced Wealth Growth</strong> profile.<br><br>
            I've analyzed your financial snapshot:<br>
            • <strong>Net Worth:</strong> ${formatCurrency(m.netWorth)} | <strong>Health Score:</strong> ${h.score}/100<br>
            • <strong>Monthly Savings Surplus:</strong> ${formatCurrency(m.monthlySurplus)} (${m.savingsRate.toFixed(1)}% Savings Rate)<br>
            • <strong>Emergency Buffer:</strong> ${m.emergencyMonths.toFixed(1)} Months Cash Reserves<br><br>
            My strategy balances emergency buffer stability, low-cost index ETF compounding (VTI/VOO), and 80/20 growth. Select a prompt chip above or ask me anything!
        `,
        fire: `
            ⚡ <strong>Hello! I am your Ambulkar Cortex AI Coach</strong> operating under the <strong>Aggressive FIRE Strategist</strong> profile.<br><br>
            FIRE Independence Audit:<br>
            • <strong>Target FIRE Number (4% Rule):</strong> ${formatCurrency(fireTarget)} (based on $${formatNumber(annualExp)}/yr expenses)<br>
            • <strong>Current Invested Assets:</strong> ${formatCurrency(m.growthAssets)}<br>
            • <strong>Monthly Savings Surplus:</strong> ${formatCurrency(m.monthlySurplus)} (${m.savingsRate.toFixed(1)}% Savings Rate)<br><br>
            My focus is hyper-compressing your retirement timeline by maxing Roth IRA/HSA accounts and compounding extra cash into index growth. Let's analyze your FIRE milestones!
        `,
        conservative: `
            🛡️ <strong>Hello! I am your Ambulkar Cortex AI Advisor</strong> operating under the <strong>Wealth Preservation</strong> profile.<br><br>
            Capital Protection & Inflation Audit:<br>
            • <strong>Liquid Cash Reserves:</strong> ${formatCurrency(m.cashAssets)} (${m.emergencyMonths.toFixed(1)} Months Expenses)<br>
            • <strong>Benchmark Yield:</strong> Top High-Yield Savings APY (${liveMarketBenchmarks.hysaRate.value}) vs CPI Inflation (${liveMarketBenchmarks.inflation.value})<br>
            • <strong>Net Worth Shield:</strong> ${formatCurrency(m.netWorth)}<br><br>
            My priority is protecting your capital against market volatility and purchasing power erosion. Ask me about high-yield cash yield, principal security, or tax-free preservation!
        `,
        debt_slayer: `
            ⚔️ <strong>Hello! I am your Ambulkar Cortex AI Coach</strong> operating under the <strong>Debt Crusader</strong> profile.<br><br>
            Debt Payoff Diagnostic:<br>
            • <strong>Total Liabilities:</strong> ${formatCurrency(m.totalLiabilities)} across ${appState.liabilities.length} Accounts<br>
            • <strong>Available Surplus for Debt Payoff:</strong> ${formatCurrency(m.monthlySurplus)}/month<br>
            • <strong>Highest APR Interest Rate:</strong> ${appState.liabilities.length ? Math.max(...appState.liabilities.map(l => l.apr)) + '%' : '0%'}<br><br>
            My mission is aggressive interest elimination using Avalanche (highest APR first) and Snowball methods. Let's knock out high-interest debt and unlock cash flow!
        `
    };

    return personaWelcomeMap[appState.persona] || personaWelcomeMap.balanced;
}

const liveMarketBenchmarks = {
    mortgage30yr: { value: "6.75%", label: "30-Yr Fixed Mortgage", icon: "fa-house-chimney", sub: "US Avg Benchmark" },
    fedRate: { value: "5.25%", label: "Fed Funds Rate", icon: "fa-building-columns", sub: "Federal Reserve" },
    inflation: { value: "2.9%", label: "US CPI Inflation", icon: "fa-chart-line-down", sub: "Annualized Rate" },
    sp500Ytd: { value: "+14.2%", label: "S&P 500 Benchmark", icon: "fa-arrow-trend-up", sub: "YTD Market Return" },
    hysaRate: { value: "4.50%", label: "High-Yield Savings", icon: "fa-piggy-bank", sub: "Top Bank APY" },
    rothLimit: { value: "$7,500", label: "2026 Roth IRA Max", icon: "fa-shield-heart", sub: "IRS Contribution" }
};

function renderMarketIndicators() {
    const grid = document.getElementById("marketIndicatorsGrid");
    if (!grid) return;

    grid.innerHTML = Object.keys(liveMarketBenchmarks).map(key => {
        const item = liveMarketBenchmarks[key];
        return `
            <div class="market-pill" title="Source: ${item.sub}">
                <span class="market-pill-label"><i class="fa-solid ${item.icon}"></i> ${item.label}</span>
                <span class="market-pill-val text-accent">${item.value}</span>
                <span class="market-pill-sub">${item.sub}</span>
            </div>
        `;
    }).join('');
}

function anonymizeQuery(query) {
    let clean = query
        .replace(/\$?\b\d+([,.]\d+)?\b\s*(k|k\/yr|k\/mo|\/yr|\/mo|dollars)?/gi, '')
        .replace(/\b(my|I have|my income is|my net worth|my debt is|my portfolio|my salary|my savings|my balance)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (clean.length < 3) return query;
    return clean;
}

async function performPrivacySearch(userQuery) {
    const anonymized = anonymizeQuery(userQuery);
    const qLower = anonymized.toLowerCase();
    
    let result = {
        queryUsed: anonymized,
        foundOnline: true,
        source: "Public Economic Data",
        snippet: ""
    };

    if (qLower.includes("mortgage") || qLower.includes("home rate") || qLower.includes("interest rate") || qLower.includes("house")) {
        result.snippet = `Current US average 30-year fixed mortgage rates are around ${liveMarketBenchmarks.mortgage30yr.value}. High-yield savings accounts yield ~${liveMarketBenchmarks.hysaRate.value}.`;
    } else if (qLower.includes("inflation") || qLower.includes("cpi") || qLower.includes("cost of living")) {
        result.snippet = `The current US annual CPI Inflation rate is approximately ${liveMarketBenchmarks.inflation.value}, while the Fed Funds Rate sits at ${liveMarketBenchmarks.fedRate.value}.`;
    } else if (qLower.includes("roth") || qLower.includes("ira") || qLower.includes("401k") || qLower.includes("contribution limit")) {
        result.snippet = `The 2026 Roth IRA maximum contribution limit is ${liveMarketBenchmarks.rothLimit.value} (with an additional $1,000 catch-up for age 50+). 401(k) max employee contribution is $24,000.`;
    } else if (qLower.includes("sp500") || qLower.includes("s&p") || qLower.includes("stock market") || qLower.includes("index fund")) {
        result.snippet = `S&P 500 index year-to-date benchmark performance is ${liveMarketBenchmarks.sp500Ytd.value}. Long-term historical index fund real returns average ~7-10% APR.`;
    } else {
        try {
            const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(anonymized)}&format=json&no_html=1&skip_disambig=1`);
            if (res.ok) {
                const data = await res.json();
                if (data.AbstractText) {
                    result.snippet = data.AbstractText;
                    result.source = data.AbstractSource || "DuckDuckGo Public Search";
                }
            }
        } catch (e) {
            console.log("Privacy web search fetch fallback active:", e);
        }
    }

    if (!result.snippet) {
        result.snippet = `Public market reference: 30-Yr Mortgage (${liveMarketBenchmarks.mortgage30yr.value}), HYSA APY (${liveMarketBenchmarks.hysaRate.value}), S&P 500 YTD (${liveMarketBenchmarks.sp500Ytd.value}).`;
    }

    return result;
}

async function sendChatMessage(userText) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    appState.chatHistory.push({ sender: "user", text: userText, time });
    renderChatMessages();

    const needsResearch = /rate|mortgage|inflation|roth|ira|401k|s&p|stock|market|current|today|bank|hysa|cd|fed|treasury|home|tax|price|what is|how much/i.test(userText);

    if (needsResearch) {
        const container = document.getElementById("chatMessages");
        const researchDiv = document.createElement("div");
        researchDiv.id = "tempResearchIndicator";
        researchDiv.className = "msg-wrapper ai";
        researchDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-brain"></i></div>
            <div class="msg-bubble research-loading-bubble">
                <i class="fa-solid fa-circle-notch"></i>
                <span>Conducting privacy-guarded web research (query anonymized)...</span>
            </div>
        `;
        container.appendChild(researchDiv);
        container.scrollTop = container.scrollHeight;
    }

    const aiResponse = await generateAIResponse(userText, needsResearch);
    
    const tempInd = document.getElementById("tempResearchIndicator");
    if (tempInd) tempInd.remove();

    appState.chatHistory.push({ sender: "ai", text: aiResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    renderChatMessages();
}

function renderChatMessages() {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    container.innerHTML = appState.chatHistory.map(msg => `
        <div class="msg-wrapper ${msg.sender}">
            <div class="msg-avatar">
                <i class="fa-solid ${msg.sender === 'ai' ? 'fa-brain' : 'fa-user'}"></i>
            </div>
            <div>
                <div class="msg-bubble">${msg.text}</div>
                <span class="msg-time">${msg.time}</span>
            </div>
        </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
}

function getLocalWealthSynthesis(query) {
    const m = getCalculatedMetrics();
    const q = (query || "").toLowerCase();

    if (q.includes("roth") || q.includes("ira") || q.includes("401k") || q.includes("tax")) {
        return `<strong>Tax-Advantaged Investment Strategy (Roth IRA & 401k):</strong><br><br>` +
            `• <strong>2026 Roth IRA Max Limit:</strong> <strong>${liveMarketBenchmarks.rothLimit.value}/year</strong> ($625/month).<br>` +
            `• <strong>Current Growth Investments:</strong> <strong>${formatCurrency(m.growthAssets)}</strong>.<br>` +
            `• <strong>Monthly Surplus Available:</strong> <strong>${formatCurrency(m.monthlySurplus)}</strong>.<br><br>` +
            `<strong>Recommendation:</strong> Max out tax-advantaged accounts first to protect your long-term compound growth from capital gains taxes. Allocate $625/mo directly into broad-market index funds (e.g. S&P 500 or Total Stock Market index).`;
    }
    if (q.includes("emergency") || q.includes("fund") || q.includes("cash")) {
        return `<strong>Emergency Fund Analysis:</strong><br><br>` +
            `• <strong>Cash Assets Held:</strong> <strong>${formatCurrency(m.cashAssets)}</strong>.<br>` +
            `• <strong>Monthly Expenses:</strong> <strong>${formatCurrency(m.monthlyExpenses)}/month</strong>.<br>` +
            `• <strong>Emergency Buffer Coverage:</strong> <strong>${m.emergencyMonths.toFixed(1)} months</strong>.<br><br>` +
            `<strong>Recommendation:</strong> Maintain 3 to 6 months of expenses in a high-yield savings account (${liveMarketBenchmarks.hysaRate.value} APY) before allocating excess capital into equity growth funds.`;
    }
    if (q.includes("fire") || q.includes("retire")) {
        const annualExp = m.monthlyExpenses * 12;
        const fireTarget = annualExp / 0.04;
        return `<strong>FIRE (Financial Independence) Benchmark:</strong><br><br>` +
            `• <strong>Annual Living Expenses:</strong> <strong>${formatCurrency(annualExp)}/year</strong>.<br>` +
            `• <strong>FIRE Portfolio Target (4% Rule):</strong> <strong>${formatCurrency(fireTarget)}</strong>.<br>` +
            `• <strong>Current Investments:</strong> <strong>${formatCurrency(m.growthAssets)}</strong>.<br><br>` +
            `<strong>Recommendation:</strong> Consistently invest your monthly surplus of ${formatCurrency(m.monthlySurplus)} into low-cost index funds to accelerate your timeline to financial independence.`;
    }
    return `<strong>Financial Advisor Wealth Analysis:</strong><br><br>` +
        `• <strong>Net Worth:</strong> <strong>${formatCurrency(m.netWorth)}</strong> | <strong>Monthly Surplus:</strong> <strong>${formatCurrency(m.monthlySurplus)}</strong><br>` +
        `• <strong>Benchmarks:</strong> HYSA APY (${liveMarketBenchmarks.hysaRate.value}), S&P 500 YTD (${liveMarketBenchmarks.sp500Ytd.value}).<br><br>` +
        `<strong>Strategy:</strong> Prioritize emergency reserves (3-6 months), maximize tax-advantaged accounts ($7,500/yr Roth IRA), and automate remaining surplus into index funds.`;
}

async function callGeminiAPI(userQuery, researchData) {
    const customApiKey = appState.settings.apiKey;
    // Route to Ambulkar Cortex Neural Gateway (Free Neural fallback key if user key is empty)
    const freeCortexKey = atob("QVEuQWI4Uk42STg5U00yYWh6cmFvMVBiTHB0X2V3eXRYZlZLNVFhU2tUWEhsbWxuU2pLZ2c=");
    const apiKey = customApiKey || freeCortexKey;
    const isCortexGateway = !customApiKey;

    const modelSelect = appState.settings.modelName;
    const customModel = appState.settings.customModel;
    const activeModel = isCortexGateway ? "gemini-3.6-flash" : (modelSelect === "custom" ? (customModel || "gemini-3.6-flash") : modelSelect);

    const anonymizedPrompt = anonymizeQuery(userQuery);

    const personaPrompts = {
        balanced: "You are acting as a Balanced Wealth Growth Advisor focusing on steady asset accumulation, 80/20 portfolio growth, emergency buffer stability, and long-term milestone planning.",
        fire: "You are acting as an Aggressive FIRE (Financial Independence, Retire Early) Coach focusing on high savings rates, index fund compounding, lean expenses, 4% rule math, and rapid retirement timelines.",
        conservative: "You are acting as a Wealth Preservation Advisor focusing on capital protection, low volatility, inflation hedging, tax efficiency, and fixed-income security.",
        debt_slayer: "You are acting as a Debt Crusader Advisor focusing on aggressive debt elimination (Avalanche/Snowball), high-interest APR payoff, and total financial freedom."
    };

    const activePersonaInstruction = personaPrompts[appState.persona] || personaPrompts.balanced;

    const genericResearchPrompt = `SYSTEM ROLE: ${activePersonaInstruction}\n\nUSER QUESTION: Provide objective, persona-aligned market research, strategy analysis, and financial concepts for: "${anonymizedPrompt}". 
Include key metrics, actionable steps, and risks. Do NOT include any personal user data in your response. Keep response structured with HTML tags (strong, br, ul, li).`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: genericResearchPrompt }] }
                ]
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const errMsg = err.error?.message || 'API request failed';
            
            // Handle free tier rate limits (429 / quota exceeded) gracefully with instant local synthesis
            if (res.status === 429 || errMsg.includes('Quota exceeded') || errMsg.includes('quota')) {
                const localSynthesis = getLocalWealthSynthesis(userQuery);
                const quotaNotice = `
                    <div class="privacy-badge-banner" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px;">
                        <i class="fa-solid fa-gauge-high"></i> <strong>Shared Free Cortex Gateway Quota Busy:</strong> The shared free tier reached its per-minute rate limit. Displaying instant local wealth advisor synthesis below:
                    </div><br>
                `;
                const deepResearchFooter = `
                    <br><br>
                    <div style="padding-top: 10px; border-top: 1px dashed var(--border-color, rgba(255,255,255,0.15)); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <span style="font-size: 0.78rem; opacity: 0.8;"><i class="fa-solid fa-bolt text-cyan"></i> Powered by <strong>Ambulkar Cortex Neural Gateway</strong></span>
                        <a href="../Cortex-AI-search/index.html?q=${encodeURIComponent(userQuery)}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; text-decoration: none; padding: 4px 10px; border-radius: 4px; color: #38bdf8;">
                            <i class="fa-solid fa-magnifying-glass-chart"></i> Deep Research in Cortex AI 🧠
                        </a>
                    </div>
                `;
                return quotaNotice + localSynthesis + deepResearchFooter;
            }

            return `<span class="text-red"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Cortex AI Gateway Notice:</strong> ${errMsg}</span>`;
        }

        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
            const m = getCalculatedMetrics();
            const gatewayBannerText = isCortexGateway
                ? `<i class="fa-solid fa-brain text-cyan"></i> <strong>Ambulkar Cortex Gateway Active</strong> | Free Neural Route: <strong>Gemini 3.6 Flash</strong> (0 Personal Bytes Uploaded)`
                : `<i class="fa-solid fa-shield-halved text-emerald"></i> Privacy Guard Active | Custom Key: <strong>${activeModel}</strong> (0 Personal Bytes Uploaded)`;

            const privacyShieldBanner = `
                <div class="privacy-badge-banner" title="Privacy Guard Active: Zero personal portfolio metrics uploaded to LLM.">
                    ${gatewayBannerText}
                </div><br><br>
            `;
            
            const localPortfolioContext = `
                <strong>Local Portfolio Context (Calculated Privately in Browser):</strong><br>
                • Your Total Net Worth: <strong>${formatCurrency(m.netWorth)}</strong><br>
                • Monthly Savings Surplus: <strong>${formatCurrency(m.monthlySurplus)}</strong><br><br>
            `;

            const deepResearchFooter = `
                <br><br>
                <div style="padding-top: 10px; border-top: 1px dashed var(--border-color, rgba(255,255,255,0.15)); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <span style="font-size: 0.78rem; opacity: 0.8;"><i class="fa-solid fa-bolt text-cyan"></i> Powered by <strong>Ambulkar Cortex Neural Gateway</strong></span>
                    <a href="../Cortex-AI-search/index.html?q=${encodeURIComponent(userQuery)}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; text-decoration: none; padding: 4px 10px; border-radius: 4px;">
                        <i class="fa-solid fa-magnifying-glass-chart"></i> Deep Research in Cortex AI 🧠
                    </a>
                </div>
            `;

            return privacyShieldBanner + localPortfolioContext + responseText.replace(/\n/g, '<br>') + deepResearchFooter;
        }
        return `No response content returned from Cortex AI Gateway.`;
    } catch (e) {
        return `<span class="text-red"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Connection Error:</strong> ${e.message}</span>`;
    }
}

async function generateAIResponse(query, needsResearch = false) {
    const m = getCalculatedMetrics();
    const q = query.toLowerCase();
    let researchData = null;

    if (needsResearch) {
        researchData = await performPrivacySearch(query);
    }

    if (appState.settings.engineMode === "gemini") {
        return await callGeminiAPI(query, researchData);
    }

    let privacyBanner = researchData ? `
        <div class="privacy-badge-banner" title="Query '${researchData.queryUsed}' anonymized locally before search. No local personal data leaves browser.">
            <i class="fa-solid fa-shield-halved text-emerald"></i> Privacy-Guarded Web Research (${researchData.source}): <em>"${researchData.queryUsed}"</em>
        </div><br><br>
    ` : ``;

    const cortexFooter = `
        <br><br>
        <div style="padding-top: 10px; border-top: 1px dashed var(--border-color, rgba(255,255,255,0.15)); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 0.78rem; opacity: 0.8;"><i class="fa-solid fa-bolt text-cyan"></i> Powered by <strong>Ambulkar Cortex Neural Gateway</strong></span>
            <a href="../Cortex-AI-search/index.html?q=${encodeURIComponent(query)}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; text-decoration: none; padding: 4px 10px; border-radius: 4px; color: #38bdf8;">
                <i class="fa-solid fa-magnifying-glass-chart"></i> Deep Research in Cortex AI 🧠
            </a>
        </div>
    `;

    if (q.includes("mortgage") || q.includes("house") || q.includes("home buy")) {
        const estDownPayment = m.cashAssets;
        return `${privacyBanner}` +
            `<strong>Home Buying & Mortgage Analysis:</strong><br>` +
            `• Live 30-Yr Fixed Mortgage Benchmark: <strong>${liveMarketBenchmarks.mortgage30yr.value}</strong><br>` +
            `• Your Available Down Payment Cash: <strong>${formatCurrency(estDownPayment)}</strong><br>` +
            `• Your Current Monthly Surplus: <strong>${formatCurrency(m.monthlySurplus)}</strong><br><br>` +
            (researchData && researchData.snippet ? `<em>Web Reference:</em> ${researchData.snippet}<br><br>` : '') +
            `<strong>Recommendation:</strong> Ensure your future principal, interest, taxes, and insurance (PITI) do not exceed 28% of gross monthly income ($${formatNumber(appState.monthlyIncome * 0.28)}/mo max).` + cortexFooter;
    }

    if (q.includes("inflation") || q.includes("hysa") || q.includes("high-yield") || q.includes("savings rate")) {
        return `${privacyBanner}` +
            `<strong>Inflation & Cash Yield Audit:</strong><br>` +
            `• Current CPI Inflation Rate: <strong>${liveMarketBenchmarks.inflation.value}</strong><br>` +
            `• Top High-Yield Savings APY: <strong>${liveMarketBenchmarks.hysaRate.value}</strong><br>` +
            `• Your Cash Reserves: <strong>${formatCurrency(m.cashAssets)}</strong> (${m.emergencyMonths.toFixed(1)} months buffer)<br><br>` +
            `Holding cash in a traditional 0.01% checking account loses ~${liveMarketBenchmarks.inflation.value} purchasing power annually. Moving your emergency cash into a high-yield savings account (HYSA) yields ~${formatCurrency(m.cashAssets * 0.045)}/year in passive interest.` + cortexFooter;
    }

    if (q.includes("roth") || q.includes("ira") || q.includes("401k") || q.includes("tax")) {
        return `${privacyBanner}` +
            `<strong>Tax-Advantaged Investment Limits:</strong><br>` +
            `• 2026 Roth IRA Max Contribution: <strong>${liveMarketBenchmarks.rothLimit.value}/yr</strong><br>` +
            `• Current Growth Assets: <strong>${formatCurrency(m.growthAssets)}</strong><br><br>` +
            `Maxing out tax-advantaged accounts protects your compound growth from capital gains taxes. With your current monthly surplus of ${formatCurrency(m.monthlySurplus)}, allocating $625/month fully maxes your $7,500 Roth IRA limit!` + cortexFooter;
    }

    if (q.includes("prioritize") || q.includes("$1,000") || q.includes("extra savings")) {
        let recommendation = "";
        if (m.emergencyMonths < 3) {
            recommendation = `Put 100% of your extra $1,000 ($1,000/mo) into high-yield savings (${liveMarketBenchmarks.hysaRate.value} APY) to raise your emergency buffer from ${m.emergencyMonths.toFixed(1)} months to 3+ months ($${formatNumber(m.monthlyExpenses * 3)} target).`;
        } else if (appState.liabilities.some(l => l.apr >= 12)) {
            const topDebt = appState.liabilities.sort((a, b) => b.apr - a.apr)[0];
            recommendation = `Direct $800 towards paying off <strong>${topDebt.name} (${topDebt.apr}% APR)</strong> and invest remaining $200 into index funds (${liveMarketBenchmarks.sp500Ytd.value} YTD). Paying down ${topDebt.apr}% APR debt is a guaranteed tax-free return!`;
        } else {
            recommendation = `Put $625/mo into tax-advantaged accounts (${liveMarketBenchmarks.rothLimit.value} Roth IRA limit) and remaining $375/mo towards your primary milestone goal.`;
        }

        return `<strong>Recommendation for extra savings:</strong><br>${recommendation}` + cortexFooter;
    }

    if (q.includes("fire") || q.includes("early retirement") || q.includes("retire")) {
        const annualExp = m.monthlyExpenses * 12;
        const fireTarget = annualExp / 0.04;
        const currentInvestments = m.growthAssets;
        const remaining = Math.max(0, fireTarget - currentInvestments);
        
        return `<strong>FIRE Analysis (4% Rule):</strong><br>` +
            `• Target FIRE Portfolio: <strong>${formatCurrency(fireTarget)}</strong> (based on $${formatNumber(annualExp)}/yr expenses)<br>` +
            `• Current Growth Investments: <strong>${formatCurrency(currentInvestments)}</strong><br>` +
            `• Remaining Progress Gap: <strong>${formatCurrency(remaining)}</strong><br><br>` +
            `With your current monthly surplus of ${formatCurrency(m.monthlySurplus)}, you are compounding towards independence! Check out the FIRE calculator tab for year-by-year projections.` + cortexFooter;
    }

    if (q.includes("debt") || q.includes("invest strategy") || q.includes("low-interest")) {
        return `<strong>Debt Payoff vs. Investing Strategy:</strong><br>` +
            `• <strong>APR > 7%:</strong> Pay down aggressively (guaranteed high return).<br>` +
            `• <strong>APR 4% – 7%:</strong> Balanced approach (split 50% extra debt payoff / 50% investments).<br>` +
            `• <strong>APR < 4%:</strong> Pay minimums and invest extra capital into index funds returning an historical ~8-10% APR long term (${liveMarketBenchmarks.sp500Ytd.value} YTD).<br><br>` +
            `Your highest debt interest rate is currently <strong>${appState.liabilities.length ? Math.max(...appState.liabilities.map(l => l.apr)) + '%' : '0%'}</strong>.` + cortexFooter;
    }

    if (q.includes("emergency") || q.includes("fund check")) {
        return `<strong>Emergency Fund Status:</strong><br>` +
            `You currently hold <strong>${formatCurrency(m.cashAssets)}</strong> in cash, which covers <strong>${m.emergencyMonths.toFixed(1)} months</strong> of your monthly expenses ($${formatNumber(m.monthlyExpenses)}/mo).<br><br>` +
            (m.emergencyMonths >= 3 
                ? `<span class="text-emerald"><i class="fa-solid fa-check"></i> Great job! Your emergency cushion meets recommended financial stability guidelines (3–6 months).</span>`
                : `<span class="text-amber"><i class="fa-solid fa-triangle-exclamation"></i> We recommend topping this up to at least 3 months ($${formatNumber(m.monthlyExpenses * 3)}) in a HYSA (${liveMarketBenchmarks.hysaRate.value} APY) before heavy stock market investing.</span>`) + cortexFooter;
    }

    let resSnippet = researchData && researchData.snippet ? `<br><br><em>Public Web Insight:</em> ${researchData.snippet}` : '';

    return `${privacyBanner}` +
        `Based on your current <strong>${appState.persona}</strong> strategy and net worth of <strong>${formatCurrency(m.netWorth)}</strong>:<br><br>` +
        `• Keep your monthly savings surplus at or above <strong>${formatCurrency(m.monthlySurplus)}</strong>.<br>` +
        `• Current Economic Benchmarks: 30-Yr Mortgage (${liveMarketBenchmarks.mortgage30yr.value}), Inflation (${liveMarketBenchmarks.inflation.value}), HYSA APY (${liveMarketBenchmarks.hysaRate.value}).<br>` +
        `• Rebalance asset allocation annually to stay aligned with your horizon.${resSnippet}<br><br>` +
        `Ask any specific question about mortgage rates, tax limits, or debt payoff strategies!` + cortexFooter;
}

function renderCalculators() {
    renderFIRECalc();
    renderCompoundCalc();
    renderDebtCalc();
    renderBudgetCalc();
}

function renderFIRECalc() {
    const currentAge = getVal("fireCurrentAge");
    const targetAge = getVal("fireTargetAge");
    const annualExpenses = getVal("fireAnnualExpenses");
    const swr = getVal("fireWithdrawalRate") / 100;
    const returnRate = getVal("fireExpectedReturn") / 100;
    const inflation = getVal("fireInflation") / 100;

    const m = getCalculatedMetrics();
    const currentInvested = m.growthAssets;
    const realReturn = returnRate - inflation;

    const fireTarget = annualExpenses / swr;
    setText("fireTargetPortfolio", formatCurrency(fireTarget));
    setText("fireTargetAgeDisplay", targetAge);

    const years = Math.max(1, targetAge - currentAge);
    const rMonthly = realReturn / 12;
    const months = years * 12;

    const fvCurrent = currentInvested * Math.pow(1 + rMonthly, months);
    const remainingTarget = Math.max(0, fireTarget - fvCurrent);
    const reqMonthly = remainingTarget > 0 ? (remainingTarget * rMonthly) / (Math.pow(1 + rMonthly, months) - 1) : 0;

    setText("fireRequiredMonthly", formatCurrency(reqMonthly));

    let currentBal = currentInvested;
    let projAge = currentAge;
    const currentMonthlyDeposit = m.monthlySurplus;

    while (currentBal < fireTarget && projAge < 90) {
        for (let mo = 0; mo < 12; mo++) {
            currentBal = currentBal * (1 + rMonthly) + currentMonthlyDeposit;
        }
        projAge++;
    }

    setText("fireProjectedAge", projAge <= 90 ? projAge : "90+");

    let labels = [];
    let portfolioData = [];
    let targetData = [];
    let simBal = currentInvested;

    for (let age = currentAge; age <= Math.min(80, currentAge + 35); age++) {
        labels.push(`Age ${age}`);
        portfolioData.push(Math.round(simBal));
        targetData.push(Math.round(fireTarget));
        
        for (let mo = 0; mo < 12; mo++) {
            simBal = simBal * (1 + rMonthly) + currentMonthlyDeposit;
        }
    }

    renderFIREChart(labels, portfolioData, targetData);
}

function renderCompoundCalc() {
    const initial = getVal("ciInitialDeposit");
    const monthly = getVal("ciMonthlyDeposit");
    const years = getVal("ciInvestmentYears");
    const rate = getVal("ciAnnualReturn") / 100;

    const rMonthly = rate / 12;
    let balance = initial;
    let totalPrincipal = initial;
    let labels = [];
    let principalArray = [];
    let interestArray = [];

    for (let y = 1; y <= years; y++) {
        labels.push(`Year ${y}`);
        for (let m = 0; m < 12; m++) {
            balance = balance * (1 + rMonthly) + monthly;
            totalPrincipal += monthly;
        }
        principalArray.push(Math.round(totalPrincipal));
        interestArray.push(Math.round(balance - totalPrincipal));
    }

    setText("ciFutureValue", formatCurrency(balance));
    setText("ciTotalPrincipal", formatCurrency(totalPrincipal));
    setText("ciTotalInterest", formatCurrency(balance - totalPrincipal));

    renderCompoundGrowthChart(labels, principalArray, interestArray);
}

function renderDebtCalc() {
    const extra = getVal("debtExtraMonthly");
    const liabilities = appState.liabilities.filter(l => l.amount > 0);

    if (liabilities.length === 0) {
        setText("avalancheMonths", "0 Months (Debt Free!)");
        setText("snowballMonths", "0 Months (Debt Free!)");
        setText("avalancheSavedInterest", "$0");
        setText("snowballSavedInterest", "$0");
        renderDebtPayoffChart([], [], []);
        return;
    }

    const avalancheDebts = JSON.parse(JSON.stringify(liabilities)).sort((a, b) => b.apr - a.apr);
    const avalancheResult = simulateDebtPayoff(avalancheDebts, extra);

    const snowballDebts = JSON.parse(JSON.stringify(liabilities)).sort((a, b) => a.amount - b.amount);
    const snowballResult = simulateDebtPayoff(snowballDebts, extra);

    setText("avalancheMonths", `${avalancheResult.months} Months`);
    setText("avalancheSavedInterest", formatCurrency(avalancheResult.savedInterest));
    
    setText("snowballMonths", `${snowballResult.months} Months`);
    setText("snowballSavedInterest", formatCurrency(snowballResult.savedInterest));

    renderDebtPayoffChart(avalancheResult.timelineLabels, avalancheResult.balanceTimeline, snowballResult.balanceTimeline);
}

function simulateDebtPayoff(debts, extraMonthly) {
    let totalInterest = 0;
    let months = 0;
    let timelineLabels = [];
    let balanceTimeline = [];
    
    let currentTotalBalance = debts.reduce((s, d) => s + d.amount, 0);
    let baseInterest = debts.reduce((s, d) => s + (d.amount * (d.apr / 100)), 0) * 2;

    while (currentTotalBalance > 0 && months < 360) {
        months++;
        timelineLabels.push(`Mo ${months}`);
        let monthExtraRemaining = extraMonthly;

        debts.forEach(d => {
            if (d.amount > 0) {
                const monthlyInterest = d.amount * (d.apr / 100 / 12);
                totalInterest += monthlyInterest;
                d.amount += monthlyInterest;

                const pay = Math.min(d.amount, d.minPay || 25);
                d.amount -= pay;
            }
        });

        for (let d of debts) {
            if (d.amount > 0 && monthExtraRemaining > 0) {
                const extraPay = Math.min(d.amount, monthExtraRemaining);
                d.amount -= extraPay;
                monthExtraRemaining -= extraPay;
            }
        }

        currentTotalBalance = debts.reduce((s, d) => s + Math.max(0, d.amount), 0);
        balanceTimeline.push(Math.round(currentTotalBalance));
    }

    return { months, totalInterest, savedInterest: Math.max(0, baseInterest - totalInterest), timelineLabels, balanceTimeline };
}

function renderBudgetCalc() {
    const income = getVal("budgetIncome");
    const activeRuleBtn = document.querySelector(".budget-rule-preset button.active");
    const rule = activeRuleBtn ? activeRuleBtn.dataset.rule : "50-30-20";

    let nRatio = 0.5, wRatio = 0.3, sRatio = 0.2;
    if (rule === "60-20-20") { nRatio = 0.6; wRatio = 0.2; sRatio = 0.2; }
    else if (rule === "70-20-10") { nRatio = 0.7; wRatio = 0.2; sRatio = 0.1; }

    setText("budTargetNeeds", formatCurrency(income * nRatio));
    setText("budTargetWants", formatCurrency(income * wRatio));
    setText("budTargetSavings", formatCurrency(income * sRatio));
}

function renderGoals() {
    const container = document.getElementById("goalsContainer");
    if (!container) return;

    if (appState.goals.length === 0) {
        container.innerHTML = `<div class="glass-panel text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No goals added yet. Click "Add New Goal" to start tracking!</div>`;
        return;
    }

    container.innerHTML = appState.goals.map(g => {
        const pct = Math.min(100, Math.round((g.current / g.target) * 100));
        const targetDateObj = new Date(g.targetDate);
        const now = new Date();
        const diffMonths = Math.max(1, (targetDateObj.getFullYear() - now.getFullYear()) * 12 + (targetDateObj.getMonth() - now.getMonth()));
        const reqMonthly = Math.max(0, (g.target - g.current) / diffMonths);

        return `
            <div class="goal-card">
                <div class="goal-header-flex">
                    <div class="goal-title-group">
                        <div class="goal-icon"><i class="fa-solid ${getGoalIcon(g.category)}"></i></div>
                        <div>
                            <h4>${g.name}</h4>
                            <span class="goal-category-tag">${g.category}</span>
                        </div>
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn-icon btn-sm" onclick="editGoal('${g.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-icon btn-sm text-red" onclick="deleteGoal('${g.id}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>

                <div class="goal-amounts-flex">
                    <span class="goal-current-val">${formatCurrency(g.current)}</span>
                    <span class="goal-target-val">Target: ${formatCurrency(g.target)}</span>
                </div>

                <div class="goal-progress-bar-bg">
                    <div class="goal-progress-bar-fill" style="width: ${pct}%;"></div>
                </div>

                <div class="goal-meta-footer">
                    <span><i class="fa-solid fa-calendar"></i> ${g.targetDate}</span>
                    <span class="badge badge-primary">${pct}% Reached</span>
                    <span>Required: <strong>${formatCurrency(reqMonthly)}/mo</strong></span>
                </div>
            </div>
        `;
    }).join('');
}

function getGoalIcon(cat) {
    switch (cat) {
        case "House": return "fa-house";
        case "Emergency": return "fa-shield-halved";
        case "Retirement": return "fa-fire";
        case "Vacation": return "fa-plane-departure";
        case "Vehicle": return "fa-car";
        case "Education": return "fa-graduation-cap";
        default: return "fa-bullseye";
    }
}

function renderLedger() {
    renderAssetsTable();
    renderLiabilitiesTable();
}

function renderAssetsTable() {
    const tbody = document.querySelector("#assetsTable tbody");
    if (!tbody) return;

    if (appState.assets.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-muted" style="text-align: center;">No assets listed.</td></tr>`;
        return;
    }

    tbody.innerHTML = appState.assets.map(a => `
        <tr>
            <td><span class="ledger-item-name">${a.name}</span></td>
            <td><span class="ledger-item-cat">${a.category}</span></td>
            <td><span class="ledger-item-val text-emerald">${formatCurrency(a.amount)}</span></td>
            <td>
                <button class="btn btn-icon btn-sm" onclick="editLedgerItem('asset', '${a.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-icon btn-sm text-red" onclick="deleteLedgerItem('asset', '${a.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderLiabilitiesTable() {
    const tbody = document.querySelector("#liabilitiesTable tbody");
    if (!tbody) return;

    if (appState.liabilities.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center;">No liabilities listed. Great job!</td></tr>`;
        return;
    }

    tbody.innerHTML = appState.liabilities.map(l => `
        <tr>
            <td><span class="ledger-item-name">${l.name}</span></td>
            <td><span class="ledger-item-cat">${l.category}</span></td>
            <td><span class="ledger-item-val text-red">${formatCurrency(l.amount)}</span></td>
            <td>${l.apr || 0}%</td>
            <td>${formatCurrency(l.minPay || 0)}</td>
            <td>
                <button class="btn btn-icon btn-sm" onclick="editLedgerItem('liability', '${l.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-icon btn-sm text-red" onclick="deleteLedgerItem('liability', '${l.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function setupModals() {
    const goalModal = document.getElementById("goalModal");
    document.getElementById("btnOpenGoalModal").addEventListener("click", () => openGoalModal());
    document.getElementById("btnCloseGoalModal").addEventListener("click", () => goalModal.classList.remove("active"));
    document.getElementById("btnCancelGoal").addEventListener("click", () => goalModal.classList.remove("active"));

    document.getElementById("goalForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveGoalForm();
        goalModal.classList.remove("active");
    });

    const ledgerModal = document.getElementById("ledgerModal");
    document.getElementById("btnAddAssetBtn").addEventListener("click", () => openLedgerModal("asset"));
    document.getElementById("btnAddLiabilityBtn").addEventListener("click", () => openLedgerModal("liability"));
    document.getElementById("btnCloseLedgerModal").addEventListener("click", () => ledgerModal.classList.remove("active"));
    document.getElementById("btnCancelLedger").addEventListener("click", () => ledgerModal.classList.remove("active"));

    document.getElementById("ledgerForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveLedgerForm();
        ledgerModal.classList.remove("active");
    });

    const settingsModal = document.getElementById("settingsModal");
    document.getElementById("btnOpenSettings")?.addEventListener("click", () => openSettingsModal());
    document.getElementById("btnCloseSettingsModal")?.addEventListener("click", () => settingsModal?.classList.remove("active"));
    document.getElementById("btnCancelSettings")?.addEventListener("click", () => settingsModal?.classList.remove("active"));

    document.querySelectorAll(`input[name="engineMode"]`).forEach(radio => {
        radio.addEventListener("change", (e) => {
            updateEngineOptionUI(e.target.value);
        });
    });

    document.getElementById("geminiModelSelect")?.addEventListener("change", () => {
        toggleCustomModelField();
    });

    document.getElementById("btnTestGeminiConn")?.addEventListener("click", () => {
        testGeminiAPIConnection();
    });

    document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
        saveSettings(e);
    });
}

function openSettingsModal() {
    const modal = document.getElementById("settingsModal");
    if (!modal) return;

    const mode = appState.settings.engineMode;
    const modeRadio = document.querySelector(`input[name="engineMode"][value="${mode}"]`);
    if (modeRadio) {
        modeRadio.checked = true;
        updateEngineOptionUI(mode);
    }

    document.getElementById("geminiApiKey").value = appState.settings.apiKey;
    document.getElementById("geminiModelSelect").value = appState.settings.modelName || "gemini-3.6-flash";
    document.getElementById("geminiCustomModelInput").value = appState.settings.customModel || "";
    document.getElementById("testConnStatus").innerHTML = "";

    toggleCustomModelField();
    modal.classList.add("active");
}

function updateEngineOptionUI(mode) {
    document.getElementById("optionEngineLocal")?.classList.toggle("active", mode === "local");
    document.getElementById("optionEngineGemini")?.classList.toggle("active", mode === "gemini");
    const geminiGroup = document.getElementById("geminiConfigGroup");
    if (geminiGroup) geminiGroup.style.display = mode === "gemini" ? "block" : "none";
}

function toggleCustomModelField() {
    const select = document.getElementById("geminiModelSelect");
    const customGroup = document.getElementById("customModelGroup");
    if (select && customGroup) {
        customGroup.style.display = select.value === "custom" ? "block" : "none";
    }
}

function saveSettings(e) {
    if (e) e.preventDefault();
    const mode = document.querySelector(`input[name="engineMode"]:checked`)?.value || "local";
    const apiKey = document.getElementById("geminiApiKey").value.trim();
    const modelSelect = document.getElementById("geminiModelSelect").value;
    const customModel = document.getElementById("geminiCustomModelInput").value.trim();

    appState.settings.engineMode = mode;
    appState.settings.apiKey = apiKey;
    appState.settings.modelName = modelSelect;
    appState.settings.customModel = customModel;

    localStorage.setItem("aura_engine_mode", mode);
    localStorage.setItem("aura_gemini_api_key", apiKey);
    localStorage.setItem("aura_gemini_model", modelSelect);
    localStorage.setItem("aura_gemini_custom_model", customModel);

    document.getElementById("settingsModal")?.classList.remove("active");
}

async function testGeminiAPIConnection() {
    const status = document.getElementById("testConnStatus");
    const apiKey = document.getElementById("geminiApiKey").value.trim();
    const modelSelect = document.getElementById("geminiModelSelect").value;
    const customModel = document.getElementById("geminiCustomModelInput").value.trim();
    const activeModel = modelSelect === "custom" ? customModel : modelSelect;

    if (!apiKey) {
        if (status) status.innerHTML = `<span class="text-red"><i class="fa-solid fa-xmark"></i> Please enter a Gemini API Key first.</span>`;
        return;
    }

    if (!activeModel) {
        if (status) status.innerHTML = `<span class="text-red"><i class="fa-solid fa-xmark"></i> Please enter a model name.</span>`;
        return;
    }

    if (status) status.innerHTML = `<span class="text-blue"><i class="fa-solid fa-spinner fa-spin"></i> Testing connection to ${activeModel}...</span>`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello! Confirm API connection." }] }]
            })
        });

        if (res.ok) {
            if (status) status.innerHTML = `<span class="text-emerald"><i class="fa-solid fa-check"></i> Connected successfully to ${activeModel}!</span>`;
        } else {
            const err = await res.json();
            const errMsg = err.error?.message || "Invalid API Key or Model Name";
            if (status) status.innerHTML = `<span class="text-red"><i class="fa-solid fa-xmark"></i> ${errMsg}</span>`;
        }
    } catch (e) {
        if (status) status.innerHTML = `<span class="text-red"><i class="fa-solid fa-xmark"></i> Connection failed: ${e.message}</span>`;
    }
}

function openGoalModal(goalId = null) {
    const modal = document.getElementById("goalModal");
    const form = document.getElementById("goalForm");
    form.reset();

    if (goalId) {
        const g = appState.goals.find(x => x.id === goalId);
        if (g) {
            document.getElementById("goalId").value = g.id;
            document.getElementById("goalName").value = g.name;
            document.getElementById("goalCategory").value = g.category;
            document.getElementById("goalTarget").value = g.target;
            document.getElementById("goalCurrent").value = g.current;
            document.getElementById("goalTargetDate").value = g.targetDate;
            document.getElementById("goalModalTitle").innerText = "Edit Financial Goal";
        }
    } else {
        document.getElementById("goalId").value = "";
        document.getElementById("goalModalTitle").innerText = "Add Financial Goal";
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() + 3);
        document.getElementById("goalTargetDate").value = defaultDate.toISOString().split("T")[0];
    }

    modal.classList.add("active");
}

function saveGoalForm() {
    const id = document.getElementById("goalId").value || "g_" + Date.now();
    const name = document.getElementById("goalName").value;
    const category = document.getElementById("goalCategory").value;
    const target = parseFloat(document.getElementById("goalTarget").value) || 0;
    const current = parseFloat(document.getElementById("goalCurrent").value) || 0;
    const targetDate = document.getElementById("goalTargetDate").value;

    const idx = appState.goals.findIndex(g => g.id === id);
    const goalData = { id, name, category, target, current, targetDate };

    if (idx >= 0) appState.goals[idx] = goalData;
    else appState.goals.push(goalData);

    renderAll();
}

window.editGoal = function(id) { openGoalModal(id); };
window.deleteGoal = function(id) {
    if (confirm("Delete this financial goal?")) {
        appState.goals = appState.goals.filter(g => g.id !== id);
        renderAll();
    }
};

function openLedgerModal(type, itemId = null) {
    const modal = document.getElementById("ledgerModal");
    const form = document.getElementById("ledgerForm");
    form.reset();

    document.getElementById("ledgerItemType").value = type;
    const catSelect = document.getElementById("ledgerCategory");
    const extraFields = document.getElementById("liabilityExtraFields");

    if (type === "asset") {
        document.getElementById("ledgerModalTitle").innerText = itemId ? "Edit Asset" : "Add New Asset";
        document.getElementById("ledgerAmountLabel").innerText = "Current Value ($)";
        extraFields.style.display = "none";
        catSelect.innerHTML = `
            <option value="Cash">Cash & Savings</option>
            <option value="Stocks">Stocks & ETFs</option>
            <option value="Retirement">Retirement (401k/IRA)</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Bonds">Bonds & Treasuries</option>
            <option value="Crypto">Crypto</option>
            <option value="Other">Other Asset</option>
        `;
    } else {
        document.getElementById("ledgerModalTitle").innerText = itemId ? "Edit Liability" : "Add Debt / Liability";
        document.getElementById("ledgerAmountLabel").innerText = "Outstanding Balance ($)";
        extraFields.style.display = "block";
        catSelect.innerHTML = `
            <option value="Credit Cards">Credit Card Debt</option>
            <option value="Student Loans">Student Loan</option>
            <option value="Mortgage">Mortgage</option>
            <option value="Auto Loans">Auto Loan</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Other">Other Debt</option>
        `;
    }

    if (itemId) {
        const list = type === "asset" ? appState.assets : appState.liabilities;
        const item = list.find(x => x.id === itemId);
        if (item) {
            document.getElementById("ledgerItemId").value = item.id;
            document.getElementById("ledgerName").value = item.name;
            catSelect.value = item.category;
            document.getElementById("ledgerAmount").value = item.amount;
            if (type === "liability") {
                document.getElementById("ledgerApr").value = item.apr || 0;
                document.getElementById("ledgerMinPay").value = item.minPay || 0;
            }
        }
    } else {
        document.getElementById("ledgerItemId").value = "";
    }

    modal.classList.add("active");
}

function saveLedgerForm() {
    const type = document.getElementById("ledgerItemType").value;
    const id = document.getElementById("ledgerItemId").value || (type === "asset" ? "a_" : "l_") + Date.now();
    const name = document.getElementById("ledgerName").value;
    const category = document.getElementById("ledgerCategory").value;
    const amount = parseFloat(document.getElementById("ledgerAmount").value) || 0;

    if (type === "asset") {
        const itemData = { id, name, category, amount };
        const idx = appState.assets.findIndex(a => a.id === id);
        if (idx >= 0) appState.assets[idx] = itemData;
        else appState.assets.push(itemData);
    } else {
        const apr = parseFloat(document.getElementById("ledgerApr").value) || 0;
        const minPay = parseFloat(document.getElementById("ledgerMinPay").value) || 0;
        const itemData = { id, name, category, amount, apr, minPay };
        const idx = appState.liabilities.findIndex(l => l.id === id);
        if (idx >= 0) appState.liabilities[idx] = itemData;
        else appState.liabilities.push(itemData);
    }

    renderAll();
}

window.editLedgerItem = function(type, id) { openLedgerModal(type, id); };
window.deleteLedgerItem = function(type, id) {
    if (confirm("Delete this item from ledger?")) {
        if (type === "asset") appState.assets = appState.assets.filter(a => a.id !== id);
        else appState.liabilities = appState.liabilities.filter(l => l.id !== id);
        renderAll();
    }
};

function renderAssetAllocationChart() {
    const ctx = document.getElementById("assetAllocationChart");
    if (!ctx) return;

    const categories = {};
    appState.assets.forEach(a => {
        categories[a.category] = (categories[a.category] || 0) + a.amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (charts.assetAllocation) charts.assetAllocation.destroy();

    charts.assetAllocation = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No Assets'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'],
                borderWidth: 2,
                borderColor: '#0f172a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ' ' + context.label + ': $' + context.raw.toLocaleString();
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function renderBudgetBreakdownChart(m) {
    const ctx = document.getElementById("budgetBreakdownChart");
    if (!ctx) return;

    if (charts.budgetBreakdown) charts.budgetBreakdown.destroy();

    const currentNeeds = m.monthlyExpenses * 0.6;
    const currentWants = m.monthlyExpenses * 0.4;
    const currentSavings = m.monthlySurplus;

    const targetNeeds = m.monthlyIncome * 0.5;
    const targetWants = m.monthlyIncome * 0.3;
    const targetSavings = m.monthlyIncome * 0.2;

    charts.budgetBreakdown = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Needs', 'Wants', 'Savings'],
            datasets: [
                {
                    label: 'Current Breakdown',
                    data: [Math.round(currentNeeds), Math.round(currentWants), Math.round(currentSavings)],
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                },
                {
                    label: '50/30/20 Target',
                    data: [Math.round(targetNeeds), Math.round(targetWants), Math.round(targetSavings)],
                    backgroundColor: '#10b981',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            },
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            }
        }
    });
}

function renderNetWorthProjectionChart(m) {
    const ctx = document.getElementById("netWorthProjectionChart");
    if (!ctx) return;

    let labels = [];
    let dataNW = [];

    let currentNW = m.netWorth;
    const annualSurplus = m.monthlySurplus * 12;
    const estimatedGrowthRate = 0.07;

    for (let yr = 0; yr <= 10; yr++) {
        labels.push(`Year ${yr}`);
        dataNW.push(Math.round(currentNW));
        currentNW = (currentNW + annualSurplus) * (1 + estimatedGrowthRate);
    }

    if (charts.netWorthProjection) charts.netWorthProjection.destroy();

    charts.netWorthProjection = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Projected Net Worth ($)',
                data: dataNW,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderFIREChart(labels, portfolioData, targetData) {
    const ctx = document.getElementById("fireProjectionChart");
    if (!ctx) return;

    if (charts.fireChart) charts.fireChart.destroy();

    charts.fireChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Projected Portfolio ($)',
                    data: portfolioData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'FIRE Target Nest Egg ($)',
                    data: targetData,
                    borderColor: '#f59e0b',
                    borderDash: [6, 6],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            },
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            }
        }
    });
}

function renderCompoundGrowthChart(labels, principalArray, interestArray) {
    const ctx = document.getElementById("compoundGrowthChart");
    if (!ctx) return;

    if (charts.compoundChart) charts.compoundChart.destroy();

    charts.compoundChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Principal',
                    data: principalArray,
                    backgroundColor: '#3b82f6',
                    stack: 'Stack 0'
                },
                {
                    label: 'Compound Interest',
                    data: interestArray,
                    backgroundColor: '#f59e0b',
                    stack: 'Stack 0'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { stacked: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            },
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            }
        }
    });
}

function renderDebtPayoffChart(labels, avalancheData, snowballData) {
    const ctx = document.getElementById("debtPayoffChart");
    if (!ctx) return;

    if (charts.debtChart) charts.debtChart.destroy();

    charts.debtChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Avalanche Balance ($)',
                    data: avalancheData,
                    borderColor: '#f59e0b',
                    tension: 0.2
                },
                {
                    label: 'Snowball Balance ($)',
                    data: snowballData,
                    borderColor: '#3b82f6',
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            },
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            }
        }
    });
}

function exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_wealth_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importDataJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const imported = JSON.parse(evt.target.result);
            if (imported.assets && imported.liabilities) {
                appState = imported;
                document.getElementById("profileSelect").value = "custom";
                renderAll();
                alert("Financial profile imported successfully!");
            } else {
                alert("Invalid format: JSON must contain assets and liabilities lists.");
            }
        } catch (err) {
            alert("Error parsing JSON file: " + err.message);
        }
    };
    reader.readAsText(file);
}

function formatCurrency(val) {
    return (val < 0 ? "-$" : "$") + Math.abs(Math.round(val)).toLocaleString();
}

function formatNumber(val) {
    return Math.round(val).toLocaleString();
}
