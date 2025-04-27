<<<<<<< HEAD
/* ============ CONFIG ============= */
const NFT_ADDRESS = "0xBFdD9B4082BFaa9203fDda96aaF6420ef70772f2";          // <-- change
const NFT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function tokenURI(uint256) view returns (string)"
];

/* ============ Main ============= */
window.onload = async ()=>{
  if(!window.ethereum){ alert("Install MetaMask"); return; }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  const signer = provider.getSigner();
  const me     = await signer.getAddress();
  const nft    = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

  const wrap = document.getElementById("collectibles-content");
  wrap.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading…</p></div>';

  try{
    const total = (await nft.balanceOf(me)).toNumber();
    if(!total){ wrap.innerHTML="<p>No collectibles yet.</p>"; return; }

    const grid=document.createElement("div");
    grid.className="collectibles-grid";
    grid.style.cssText="display:flex;flex-wrap:wrap;gap:20px;padding:20px;";

    let found=0,id=0;
    while(found<total && id<1000){
      try{
        if((await nft.ownerOf(id)).toLowerCase()===me.toLowerCase()){
          const uri  = await nft.tokenURI(id);
          const meta = await (await fetch(uri.replace("ipfs://","https://gateway.pinata.cloud/ipfs/"))).json();
          const card = document.createElement("div");
          card.className="collectible-card";
          card.style.cssText="border:1px solid #333;border-radius:8px;padding:10px;width:200px;text-align:center;background:#1a1a1a;";
          card.innerHTML=`<img src="${meta.image.replace("ipfs://","https://gateway.pinata.cloud/ipfs/")}" style="width:100%;border-radius:8px"><h3 style="margin-top:10px;">${meta.name}</h3><p style="font-size:.8em;color:#888;">ID #${id}</p>`;
          grid.appendChild(card);
          found++;
        }
      }catch{}
      id++;
    }
    wrap.innerHTML=""; wrap.appendChild(grid);
  }catch(e){ console.error(e); wrap.innerHTML="<p>Failed to load NFTs.</p>"; }
};
=======
// DOM Elements
const collectiblesContent = document.getElementById('collectibles-content');

// State
let isConnected = false;
let userAddress = '';
let userNFTs = [];
let isLoading = true;

// Initialize the page
async function initialize() {
  console.log("Initializing collectibles page...");
  
  // Check if wallet is connected
  await checkWalletConnection();
  
  // Render the UI based on connection state
  renderUI();
}

// Check if wallet is connected
async function checkWalletConnection() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts && accounts.length > 0) {
        isConnected = true;
        userAddress = accounts[0];
        console.log("Connected to wallet:", userAddress);
        
        // Fetch NFTs
        await fetchNFTs(userAddress);
      } else {
        isLoading = false;
      }
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      isLoading = false;
    }
  } else {
    console.log("MetaMask is not installed");
    isLoading = false;
  }
}

// Handle account changes
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // User disconnected
    isConnected = false;
    userAddress = '';
    userNFTs = [];
    renderUI();
  } else {
    // User switched accounts
    isConnected = true;
    userAddress = accounts[0];
    isLoading = true;
    renderUI();
    fetchNFTs(accounts[0]);
  }
}

// Connect wallet
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      isLoading = true;
      renderUI();
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        isConnected = true;
        userAddress = accounts[0];
        await fetchNFTs(accounts[0]);
      }
      
      renderUI();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      isLoading = false;
      renderUI();
    }
  } else {
    alert("Please install MetaMask to use this feature!");
  }
}

// Fetch NFTs for the connected address
async function fetchNFTs(address) {
  try {
    console.log("Fetching NFTs for address:", address);
    
    // In a real application, you would fetch NFTs from the blockchain
    // For demo purposes, we'll use mock data and simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock NFT data
    userNFTs = [
      {
        id: 1,
        name: "Concert #1 - VIP Access",
        image: "https://source.unsplash.com/random/300x300/?concert,vip",
        date: "April 15, 2023",
        artist: "Electronic Vibes",
        rarity: "Rare"
      },
      {
        id: 2,
        name: "Backstage Pass",
        image: "https://source.unsplash.com/random/300x300/?concert,backstage",
        date: "May 22, 2023",
        artist: "Rock Legends",
        rarity: "Epic"
      },
      {
        id: 3,
        name: "Festival Weekend",
        image: "https://source.unsplash.com/random/300x300/?festival",
        date: "July 10, 2023",
        artist: "Various Artists",
        rarity: "Common"
      }
    ];
    
    isLoading = false;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    isLoading = false;
  }
}

// Render the UI based on the current state
function renderUI() {
  if (!isConnected) {
    // Render connect wallet UI
    collectiblesContent.innerHTML = `
      <div class="wallet-connect-card">
        <div class="wallet-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        </div>
        <h2 class="text-xl font-bold mb-4">Connect Your Wallet</h2>
        <p class="text-secondary mb-6">Connect your wallet to view your collectible NFTs</p>
        <button id="connectWalletBtn" class="connect-wallet-btn">Connect Wallet</button>
      </div>
    `;
    
    // Add event listener to the connect wallet button
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
  } else if (isLoading) {
    // Render loading UI
    collectiblesContent.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading your collectibles...</p>
      </div>
    `;
  } else if (userNFTs.length === 0) {
    // Render empty state
    collectiblesContent.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        <h3 class="empty-title">No NFTs Found</h3>
        <p class="empty-description">You don't have any concert NFTs yet. Claim your first POAP on the home page!</p>
      </div>
    `;
  } else {
    // Render wallet status and NFT grid
    collectiblesContent.innerHTML = `
      <div class="wallet-status">
        <div class="wallet-status-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <path d="M20 12V8H6a2 2 0 1 1 0-4h12v4"></path>
            <path d="M20 12V8H6a2 2 0 1 1 0-4h12v4"></path>
            <path d="M20 12v4H6a2 2 0 1 0 0 4h12v-4"></path>
          </svg>
        </div>
        <div>
          <p class="text-secondary text-sm">Connected Wallet</p>
          <p class="font-medium">${shortenAddress(userAddress)}</p>
        </div>
        <span class="status-badge">Connected</span>
      </div>
      
      <div class="nft-grid">
        ${userNFTs.map(nft => renderNFTCard(nft)).join('')}
      </div>
    `;
  }
}

// Render an NFT card
function renderNFTCard(nft) {
  let rarityClass = 'badge-common';
  if (nft.rarity === 'Rare') rarityClass = 'badge-rare';
  if (nft.rarity === 'Epic') rarityClass = 'badge-epic';
  
  return `
    <div class="nft-card">
      <img src="${nft.image}" alt="${nft.name}" class="nft-image">
      <div class="nft-content">
        <h3 class="nft-title">${nft.name}</h3>
        <div class="nft-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${nft.date}</span>
        </div>
        <div class="nft-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <span>${nft.artist}</span>
        </div>
        <div class="nft-footer">
          <span class="nft-badge ${rarityClass}">${nft.rarity}</span>
          <a href="#" class="nft-link">View Details</a>
        </div>
      </div>
    </div>
  `;
}

// Helper function to shorten address
function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
>>>>>>> 6d6b6d551b39dbffcde826835191e7f6d9db0e9b
