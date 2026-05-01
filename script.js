// --- CONFIGURATION ---
// 1. Put your cell number here. 
// Most banks prefer the full 10 digits (e.g., 0711196825)
const myShapID = "0711196825"; 

// 2. Put your Business/Studio Name here (no spaces)
const myName = "j4rise_studios"; 

function setAmount(val) {
    const input = document.getElementById('amount');
    input.value = (parseFloat(input.value || 0) + val).toFixed(2);
}

function generateQR() {
    const amountInput = document.getElementById('amount').value;
    if(!amountInput) return alert("Please enter an amount.");

    const amount = parseFloat(amountInput).toFixed(2);
    const shapID = "0711196825"; // Your confirmed number
    const merchantName = "J4RISE STUDIOS"; 

    /* EMVCo Tag Breakdown for PayShap 2026:
       00: Payload Version (01)
       01: Point of Initiation (12 for Dynamic)
       26: Merchant Account Info (PayShap)
       54: Transaction Amount
       58: Country Code (ZA)
       59: Merchant Name
    */
    
    // Tag 26: PayShap Identifier + Your Number
    const tag26Content = `0010${shapID}`;
    const tag26 = `26${tag26Content.length.toString().padStart(2, '0')}${tag26Content}`;
    
    // Build the full string
    let emv = `000201010212`; // Version + Dynamic
    emv += tag26;
    emv += `52040000`; // Category
    emv += `5303710`; // Currency: ZAR
    emv += `54${amount.length.toString().padStart(2, '0')}${amount}`; // Amount
    emv += `5802ZA`;  // Country
    emv += `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`;
    emv += `6008PRETORIA`; // City
    emv += `6304`; // Checksum placeholder

    // Generate the code
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ""; 
    new QRCode(canvas, {
        text: emv,
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.M
    });

    document.getElementById('qr-area').classList.remove('hidden');
    document.querySelector('.button-grid').classList.add('hidden');
}

function checkStatus(ref) {
    const statusInterval = setInterval(async () => {
        // In a real live environment, you would call Ozow's API here
        // For now, this is where the "Success" logic lives
        console.log("Checking status for: " + ref);

        // Once the API returns 'Complete', we show the success screen
        // if (apiResponse.status === 'Complete') { 
        //    clearInterval(statusInterval);
        //    showSuccess();
        // }
        
        // For demo purposes, simulate payment success after 10 seconds
        setTimeout(() => {
            clearInterval(statusInterval);
            showSuccess();
        }, 10000);
    }, 5000); // Check every 5 seconds
}

function showSuccess() {
    const qrArea = document.getElementById('qr-area');
    qrArea.innerHTML = `
        <div style="color: #00a859; font-size: 5rem;">✅</div>
        <h2 style="color: #00a859;">SHAP! PAYMENT RECEIVED</h2>
        <p>Your R${document.getElementById('amount').value} is in the bank.</p>
        <button onclick="location.reload()">Next Sale</button>
    `;
    // Add a vibe! Play a "Ka-ching" sound
    new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3').play();
}

function copyShapID() {
    const shapID = "0711196825";
    
    navigator.clipboard.writeText(shapID).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.innerText = "✅ Copied to Clipboard!";
        btn.style.background = "#007a41"; // Darker green for success

        // Reset the button after 2 seconds
        setTimeout(() => {
            btn.innerText = "📋 Copy ShapID (0711196825)";
            btn.style.background = "#00a859";
        }, 2000);
    }).catch(err => {
        alert("Manual copy: 0711196825");
    });
}

function reset() {
    location.reload();
}

// This function ensure the receiver stays on the app, and doesn't get redirected to the payment page

function openSecurePayment(url) {
    // This creates a "Modal" (a window on top of your site)
    const paymentWindow = document.createElement('div');
    paymentWindow.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: white;
        z-index: 1000;
    `;
    
    // We put the Ozow/Paystack payment page inside this frame
    paymentWindow.innerHTML = `<iframe src="${url}" style="width:100%; height:100%; border:none;"></iframe>`;
    document.body.appendChild(paymentWindow);

    // Later, when the payment is done, we just remove the window
    // paymentWindow.remove();
}