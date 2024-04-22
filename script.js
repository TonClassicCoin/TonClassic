const walletGroupsContainer = document.getElementById('wallet-group');
const sumarryBar = document.getElementById('sumarry-bar');
const summaryText = document.getElementById('sumarry-text');
const summaryTextC = document.getElementById('sumarry-text-c');
sumarryBar.style.width = `${0}%`;

const extraSmallGiversMaxVolume = 448500000
const smallGiversMaxVolume = 138000000
const mediumGiversMaxVolume = 69000000
const largeGiversMaxVolume = 9999999999999

const totalDiff = BigInt('115792089237277217110272752943501742914102634520085823245724998868298727686144')
const hashrate3080 = BigInt('2000000000');

const givers = {
    "largeGivers": [
        { "mainAddress": "UQAZF5RoTu8wuzR1LFaCgV91WO3_CqTaQ1iWXK9y30dI6ZGh", "jettonAddress": "EQAqbli980TibH4Ycgjcr8DjmfuNc2Pqt7hT3VHikYDWJ1pP" },
};

// Function to fetch wallet balance
async function getWalletBalance(address) {
    const response = await fetch('https://mainnet.tonhubapi.com/runGetMethod', {
        method: 'POST',
        body: JSON.stringify({
            address,
            method: 'get_wallet_data',
            stack: []
        })
    });
    const data = await response.json();
    const balanceHex = data.result.stack[0][1];
    return parseInt(balanceHex, 16); // Convert hex to decimal
}

async function getGiverComplexity(address) {
    const response = await fetch('https://mainnet.tonhubapi.com/runGetMethod', {
        method: 'POST',
        body: JSON.stringify({
            address,
            method: 'get_pow_params',
            stack: []
        })
    });
    const data = await response.json();
    const balanceHex = data.result.stack[1][1];
    const hashes = totalDiff / BigInt(parseInt(balanceHex, 16));
    return hashes
}

function formatN(n) {
    const unitList = ['y', 'z', 'a', 'f', 'p', 'n', 'u', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    const zeroIndex = 8;
    const nn = n.toExponential(2).split(/e/);
    let u = Math.floor(+nn[1] / 3) + zeroIndex;
    if (u > unitList.length - 1) {
        u = unitList.length - 1;
    } else
        if (u < 0) {
            u = 0;
        }
    return nn[0] * Math.pow(10, +nn[1] - (u - zeroIndex) * 3) + unitList[u];
}

async function createProgressBar(giver, name) {
    const groupElement = document.createElement('div');
    groupElement.classList.add('wallet-group');
    const link = document.createElement('a');
    link.href = 'https://tonviewer.com/' + giver.mainAddress;
    link.classList.add('address')
    link.target = '_blank';

    var text = document.createElement('p');
    text.innerHTML = `${name}: ... <br>Mining progress: ...`;
    text.id = `text-${giver.mainAddress}%`;
    link.appendChild(text)
    groupElement.appendChild(link)

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');

    const progressBarFill = document.createElement('div');
    progressBarFill.id = `progres-bar-${giver.mainAddress}%`;
    progressBarFill.classList.add('progress-bar-fill');
    progressBarFill.style.width = `${0}%`;
    progressBar.appendChild(progressBarFill);

    groupElement.appendChild(progressBar);

    walletGroupsContainer.appendChild(groupElement);
}

async function fillProgressBar(giver, balance, percentage, name, maxVolume, hashes) {
    const text = document.getElementById(`text-${giver.mainAddress}%`);
    const progressBarFill = document.getElementById(`progres-bar-${giver.mainAddress}%`);
    const baseLabel = `${name}: ${balance.toLocaleString('en-US')}/${maxVolume.toLocaleString('en-US')} TONC<br>Mining progress: `
    if (hashes != 0) {
        let secondsOn3080 = hashes / hashrate3080
        text.innerHTML = baseLabel + `${(100 - percentage).toFixed(2)}% Hashes: ${formatN(Number(hashes))} Seconds on 3080: ${secondsOn3080}`;
    } else {
        text.innerHTML = baseLabel + "Done.";
    }
    progressBarFill.style.width = `${percentage}%`;
}

async function createSeparator() {
    const div = document.createElement('div')
    const h3 = document.createElement('h3')
    h3.innerText = "~.~"
    div.appendChild(h3)
    walletGroupsContainer.appendChild(div)
}


// Function to create and display wallet groups
async function spawnProgressBars() {
    createSeparator()
    for (let i = 0; i < givers.small_givers.length; i++) { createProgressBar(givers.small_givers[i], "Small Giver #" + (i + 1).toString()) }
    createSeparator()
    for (let i = 0; i < givers.extra_small_givers.length; i++) { createProgressBar(givers.extra_small_givers[i], "Extra Small Giver #" + (i + 1).toString()) }
    createSeparator()
    for (let i = 0; i < givers.largeGivers.length; i++) { createProgressBar(givers.largeGivers[i], "Large Giver #" + (i + 1).toString()) }
    createSeparator()
    for (let i = 0; i < givers.medium_givers.length; i++) { createProgressBar(givers.medium_givers[i], "Medium Giver #" + (i + 1).toString()) }
}

async function fillProgressBars() {
    var total = 0;
    var totalRemain = 0;

    // Fill small givers bars
    for (let i = 0; i < givers.small_givers.length; i++) {
        const giver = givers.small_givers[i]

        await new Promise(r => setTimeout(r, 300));
        try { var balance = await getWalletBalance(giver.EQAqbli980TibH4Ycgjcr8DjmfuNc2Pqt7hT3VHikYDWJ1pP) / 1000000000; } catch (err) { i--; continue }

        const percentage = ((balance) / smallGiversMaxVolume) * 100;

        await new Promise(r => setTimeout(r, 300));
        try { var hashes = await getGiverComplexity(giver.mainAddress); } catch (err) { i--; continue }

        fillProgressBar(giver, balance, percentage, "Small Giver #" + (i + 1).toString(), smallGiversMaxVolume, hashes)

        total += smallGiversMaxVolume;
        totalRemain += balance;
    }
    // Fill extra small givers bars
    for (let i = 0; i < givers.extra_small_givers.length; i++) {
        const giver = givers.extra_small_givers[i]

        await new Promise(r => setTimeout(r, 300));
        try { var balance = await getWalletBalance(giver.EQAqbli980TibH4Ycgjcr8DjmfuNc2Pqt7hT3VHikYDWJ1pP) / 1000000000; } catch (err) { i--; continue }

        const percentage = ((balance) / extraSmallGiversMaxVolume) * 100;

        await new Promise(r => setTimeout(r, 300));
        try { var hashes = await getGiverComplexity(giver.mainAddress); } catch (err) { i--; continue }

        fillProgressBar(giver, balance, percentage, "Extra Small Giver #" + (i + 1).toString(), extraSmallGiversMaxVolume, hashes)

        total += extraSmallGiversMaxVolume;
        totalRemain += balance;
    }
    // Fill large givers bars
    for (let i = 0; i < givers.largeGivers.length; i++) {
        const giver = givers.largeGivers[i]

        fillProgressBar(giver, 0, 0, "Large Giver #" + (i + 1).toString(), largeGiversMaxVolume, 0)

        total += largeGiversMaxVolume;
    }
    // Fill medium givers bars
    for (let i = 0; i < givers.medium_givers.length; i++) {
        const giver = givers.medium_givers[i]

        fillProgressBar(giver, 0, 0, "Medium Giver #" + (i + 1).toString(), mediumGiversMaxVolume, 0)

        total += mediumGiversMaxVolume;
    }

    sumarryBar.style.width = `${((totalRemain / total) * 100)}%`;
    summaryTextC.textContent = `Mining progress: ${(100 - (totalRemain / total) * 100).toFixed(2)}%`;
    summaryText.textContent = `Total Givers Balance: ${totalRemain.toLocaleString('en-US')}/${total.toLocaleString('en-US')} TONC`;
}

async function switchTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme')
    } else {
        document.body.classList.add('dark-theme')
    }
}

const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
if (darkThemeMq.matches) {
    document.body.classList.add('dark-theme')
}

spawnProgressBars();
// Initial data fetching and display
fillProgressBars();
