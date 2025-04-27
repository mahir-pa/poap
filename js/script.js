<<<<<<< HEAD
/* ============ CONFIG – fill once ============= */
const ROUTER_ADDRESS = "0x3E80DA6ea25a799e9e377b0c2AF758a98e94Ab13";   // <-- change
const ROUTER_ABI = [
  "function mintWithSecret(string secretWord) external"
];

/* ============ Globals ============= */
let provider, signer, router, connected = false;

/* ============ DOM refs ============= */
const secretInput = document.getElementById("secretInput");
const claimBtn    = document.getElementById("claimButton");
const statusTxt   = document.getElementById("statusText");
const statusDot   = document.getElementById("statusDot");
const msgEl       = document.getElementById("message");

/* ============ Helpers ============= */
const short = a => a.slice(0,6) + "…" + a.slice(-4);
const setStatus = (t,c)=>{ statusTxt.textContent=t; statusDot.className="status-dot "+c; };
const setMsg = (t,c="") => { msgEl.textContent=t; msgEl.className="message "+c; msgEl.style.display=t?"block":"none"; };

/* ============ Init ============= */
document.addEventListener("DOMContentLoaded",()=>{ claimBtn.onclick = connect; });

/* ============ Connect ============= */
async function connect(){
  if(!window.ethereum){ setMsg("Install MetaMask","error"); return; }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  signer  = provider.getSigner();
  router  = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

  const me = await signer.getAddress();
  connected = true;
  setStatus("Connected: "+short(me),"connected");
  claimBtn.textContent = "Mint POAP";
  claimBtn.onclick     = mint;
}

/* ============ Mint ============= */
async function mint(){
  const word = secretInput.value.trim();
  if(!word){ setMsg("Enter the secret word","error"); return; }

  try{
    setMsg("Submitting…","pending");
    claimBtn.disabled = true;
    const tx = await router.mintWithSecret(word);
    await tx.wait();
    setMsg("🎉 NFT minted! Check BlockScout.","success");
  }catch(err){
    console.error(err);
    if(err.message.includes("Already")) setMsg("You already minted with this code","error");
    else if(err.message.includes("invalid")) setMsg("Wrong secret word","error");
    else setMsg("Mint failed – see console","error");
  }finally{ claimBtn.disabled=false; }
}
=======
const CONTRACT_ADDRESS = "0x8f0d309DEAc33A211423071473A66E6113fa80f7";
const ABI = [
  "function claimPOAP(string inputWord) external",
  "function isExpired() external view returns (bool)"
];

let provider;
let signer;
let contract;
let isConnected = false;

// DOM Elements
const secretInput = document.getElementById('secretInput');
const claimButton = document.getElementById('claimButton');
const statusText = document.getElementById('statusText');
const statusDot = document.getElementById('statusDot');
const messageEl = document.getElementById('message');
const contractStatusEl = document.getElementById('contractStatus');

// Initialize the app
function initialize() {
  console.log("Initializing app...");
  updateConnectionStatus('Not connected', 'disconnected');
  
  // Add event listener to button
  claimButton.addEventListener('click', handleButtonClick);
  
  if (typeof window.ethereum !== 'undefined') {
    console.log("MetaMask is installed");
    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    // Check if already connected
    checkIfConnected();
  } else {
    console.log("MetaMask is not installed");
    updateMessage('Please install MetaMask to use this app', 'error');
  }
}

// Check if already connected to MetaMask
async function checkIfConnected() {
  try {
    console.log("Checking if already connected to MetaMask...");
    
    // Check if ethereum is available
    if (!window.ethereum) {
      console.log("Ethereum object not found");
      return;
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    console.log("Current accounts:", accounts);
    
    if (accounts && accounts.length > 0) {
      console.log("Already connected to account:", accounts[0]);
      setupEthers(accounts[0]);
    } else {
      console.log("No accounts found or not connected");
    }
  } catch (error) {
    console.error("Error checking accounts:", error);
    // Don't throw an error, just log it
  }
}

// Handle button click based on connection state
async function handleButtonClick() {
  console.log("Button clicked, isConnected:", isConnected);
  if (!isConnected) {
    await connectWallet();
  } else {
    await claimPOAP();
  }
}

// Handle account changes
function handleAccountsChanged(accounts) {
  console.log("Accounts changed:", accounts);
  if (accounts.length === 0) {
    // User disconnected
    isConnected = false;
    updateConnectionStatus('Not connected', 'disconnected');
    claimButton.textContent = 'Connect Wallet';
    updateMessage('Wallet disconnected', 'error');
  } else {
    // User switched accounts
    setupEthers(accounts[0]);
  }
}

// Setup ethers with the connected account
async function setupEthers(account) {
  try {
    console.log("Setting up ethers with account:", account);
    
    // Make sure ethers is available
    if (typeof ethers === 'undefined') {
      console.error("Ethers library not loaded!");
      updateMessage('Ethers library not loaded. Please refresh the page.', 'error');
      return false;
    }
    
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    
    isConnected = true;
    updateConnectionStatus('Connected: ' + shortenAddress(account), 'connected');
    claimButton.textContent = 'Claim POAP';
    
    // Check if the contract is expired
    checkContractStatus();
    
    return true;
  } catch (error) {
    console.error("Error setting up ethers:", error);
    updateMessage('Error setting up connection: ' + error.message, 'error');
    return false;
  }
}

// Connect wallet function
async function connectWallet() {
  console.log("Connecting wallet...");
  if (typeof window.ethereum === 'undefined') {
    updateMessage('Please install MetaMask!', 'error');
    return false;
  }
  
  try {
    updateConnectionStatus('Connecting...', 'pending');
    
    // Request accounts access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Connected accounts:", accounts);
    
    if (accounts.length === 0) {
      updateConnectionStatus('Not connected', 'disconnected');
      return false;
    }
    
    return setupEthers(accounts[0]);
  } catch (error) {
    console.error("Connection error:", error);
    updateConnectionStatus('Connection failed', 'disconnected');
    updateMessage(error.message, 'error');
    return false;
  }
}

// Check if the contract is expired
async function checkContractStatus() {
  if (!contract) return;
  
  try {
    console.log("Checking contract status...");
    const expired = await contract.isExpired();
    console.log("Contract expired:", expired);
    
    if (expired) {
      contractStatusEl.textContent = 'This POAP claim has expired';
      contractStatusEl.style.color = 'var(--error-color)';
      claimButton.disabled = true;
    } else {
      contractStatusEl.textContent = 'POAP claim is active';
      contractStatusEl.style.color = 'var(--success-color)';
    }
  } catch (error) {
    console.error("Error checking contract status:", error);
    contractStatusEl.textContent = 'Could not check contract status';
    contractStatusEl.style.color = 'var(--warning-color)';
  }
}

// Claim POAP function
async function claimPOAP() {
  console.log("Claiming POAP...");
  if (!isConnected) {
    const connected = await connectWallet();
    if (!connected) return;
  }
  
  const inputWord = secretInput.value.trim();
  if (!inputWord) {
    updateMessage('Please enter the secret word!', 'error');
    return;
  }
  
  try {
    updateMessage('Claiming your POAP...', 'pending');
    claimButton.disabled = true;
    claimButton.textContent = 'Processing...';
    
    console.log("Calling contract with input:", inputWord);
    const tx = await contract.claimPOAP(inputWord);
    console.log("Transaction submitted:", tx.hash);
    updateMessage('Transaction submitted! Waiting for confirmation...', 'pending');
    
    await tx.wait();
    console.log("Transaction confirmed!");
    updateMessage('POAP minted successfully! Check your wallet on Asset Hub 🥳', 'success');
    
    // Add confetti effect
    createConfetti();
  } catch (error) {
    console.error("Error claiming POAP:", error);
    let errorMessage = 'Failed to mint. ';
    
    if (error.message.includes('user rejected')) {
      errorMessage += 'Transaction was rejected.';
    } else if (error.message.includes('already claimed')) {
      errorMessage += 'You have already claimed this POAP.';
    } else if (error.message.includes('invalid code')) {
      errorMessage += 'Wrong secret word.';
    } else if (error.message.includes('expired')) {
      errorMessage += 'This POAP claim has expired.';
    } else {
      errorMessage += 'Please check your input and try again.';
    }
    
    updateMessage(errorMessage, 'error');
  } finally {
    claimButton.disabled = false;
    claimButton.textContent = 'Claim POAP';
  }
}

// Helper function to update connection status
function updateConnectionStatus(text, status) {
  statusText.textContent = text;
  statusDot.className = 'status-dot ' + status;
}

// Helper function to update message
function updateMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
  
  // Make sure the message is visible
  if (type) {
    messageEl.style.display = 'block';
  } else {
    messageEl.style.display = 'none';
  }
}

// Helper function to shorten address
function shortenAddress(address) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

// Create confetti effect on successful claim
function createConfetti() {
  const colors = ['#6c5ce7', '#fd79a8', '#00b894', '#fdcb6e', '#0984e3'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.opacity = Math.random();
    confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    
    document.body.appendChild(confetti);
    
    // Animate falling
    const animation = confetti.animate(
      [
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        { transform: 'translate3d(' + (Math.random() * 100 - 50) + 'px, 100vh, 0)', opacity: 0 }
      ],
      {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: Math.random() * 1000
      }
    );
    
    animation.onfinish = () => confetti.remove();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);

// Log that the script has loaded
console.log("POAP claim script loaded");
>>>>>>> 6d6b6d551b39dbffcde826835191e7f6d9db0e9b
