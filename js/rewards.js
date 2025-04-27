<<<<<<< HEAD
const CONTRACT_ADDRESS = "0xB59EA1411B8B84bAbC3e63140c3509a62EC48273"; // your deployed contract
const ABI = [
  "function balanceOf(address owner) external view returns (uint256)"
];

let signer;
let contract;
let currentRewardButton = null; // track which reward is being claimed
let confettiCanvasLoaded = false;

async function connectWalletAndLoadRewards() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const rewardsList = document.getElementById('rewards-list');

  try {
    const balance = await contract.balanceOf(userAddress);
    const collectibles = balance.toNumber();
    console.log("NFTs owned:", collectibles);

    rewardsList.innerHTML = '';

    const rewards = [
      {
        name: "Exclusive Hoodie",
        description: "Collect 5 Dua Lipa POAPs to claim!",
        needed: 5,
        image: "https://via.placeholder.com/150?text=Hoodie"
      },
      {
        name: "Limited Edition Jumpsuit",
        description: "Collect 20 Dua Lipa POAPs to unlock!",
        needed: 20,
        image: "https://via.placeholder.com/150?text=Jumpsuit"
      }
    ];

    rewards.forEach(reward => {
      const card = document.createElement('div');
      card.className = 'reward-card';

      const percent = Math.min((collectibles / reward.needed) * 100, 100);

      card.innerHTML = `
        <div class="reward-header">
          <div class="reward-icon">
            <img src="${reward.image}" alt="${reward.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
          </div>
          <div class="reward-content">
            <div class="reward-title">${reward.name}</div>
            <div class="reward-description">${reward.description}</div>
          </div>
        </div>

        <div class="reward-footer">
          <div class="reward-progress">
            <div class="reward-progress-text">${Math.min(collectibles, reward.needed)}/${reward.needed}</div>
            <div class="reward-progress-bar">
              <div class="reward-progress-fill" style="width: ${percent}%"></div>
            </div>
          </div>
          <button class="reward-button ${collectibles >= reward.needed ? 'unlocked' : 'locked'}" ${collectibles >= reward.needed ? '' : 'disabled'} onclick="claimReward(this, '${reward.name}')">
            ${collectibles >= reward.needed ? 'Claim Now' : 'Claim'}
          </button>
        </div>
      `;

      rewardsList.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading rewards:", error);
    rewardsList.innerHTML = "<p>Failed to load rewards.</p>";
  }
}

function claimReward(buttonElement, rewardName) {
  const popup = document.getElementById('reward-popup');
  const popupContent = document.getElementById('reward-popup-content');
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';

  popupContent.innerHTML = `
    <h2 style="color:black;">🎉 Congratulations! 🎉</h2>
    <p style="color:black;">You are eligible for the <strong>${rewardName}</strong>!</p>
    <p style="color:black;">Enter your Gmail to be contacted for shipping:</p>
    <input type="email" id="emailInput" placeholder="Enter your Gmail" style="padding:8px;margin:10px 0;width:100%;border-radius:6px;">
    <button onclick="submitEmail()" style="padding:8px 16px;margin-top:10px;border:none;background-color:#00aaff;color:white;border-radius:6px;cursor:pointer;">Submit</button>
  `;

  currentRewardButton = buttonElement;
  startConfetti();
}

function submitEmail() {
  const email = document.getElementById('emailInput').value;
  if (!email.includes('@gmail.com')) {
    alert("Please enter a valid Gmail address!");
    return;
  }

  const popupContent = document.getElementById('reward-popup-content');
  popupContent.innerHTML = `
    <h2 style="color:black;">✅ Thank you!</h2>
    <p style="color:black;">We will contact you soon at <strong>${email}</strong> for next steps!</p>
  `;

  // Fire confetti again after successful submission
  startConfetti();

  // After 5 seconds, close popup and update button
  setTimeout(() => {
    const popup = document.getElementById('reward-popup');
    popup.style.display = 'none';

    if (currentRewardButton) {
      currentRewardButton.innerText = "Claimed ✅";
      currentRewardButton.disabled = true;
      currentRewardButton.classList.remove('unlocked');
      currentRewardButton.classList.add('locked');
    }
  }, 5000);
}

// Confetti Scripts
function startConfetti() {
  if (!confettiCanvasLoaded) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    script.onload = () => {
      confettiCanvasLoaded = true;
      fireConfetti();
    };
    document.body.appendChild(script);
  } else {
    fireConfetti();
  }
}

function fireConfetti() {
  confetti({
    particleCount: 300,
    spread: 90,
    origin: { y: 0.6 }
  });
}

window.onload = connectWalletAndLoadRewards;
=======
// DOM Elements
const rewardsContent = document.getElementById('rewards-content');

// State
let isConnected = false;
let userAddress = '';
let collectiblesCount = 3; // Mock data - in a real app, this would be fetched from the blockchain
let isLoading = true;

// Rewards data
const rewards = [
  {
    id: 1,
    name: "VIP Concert Access",
    description: "Get VIP access to an exclusive concert",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>`,
    required: 5,
    color: "linear-gradient(135deg, #6c5ce7, #fd79a8)",
    claimed: false
  },
  {
    id: 2,
    name: "Backstage Pass",
    description: "Meet your favorite artists backstage",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    required: 10,
    color: "linear-gradient(135deg, #0984e3, #00cec9)",
    claimed: false
  },
  {
    id: 3,
    name: "Limited Edition Merch",
    description: "Exclusive merchandise only for collectors",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
    required: 3,
    color: "linear-gradient(135deg, #fdcb6e, #e17055)",
    claimed: false
  },
  {
    id: 4,
    name: "Free Album Download",
    description: "Download upcoming albums for free",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    required: 2,
    color: "linear-gradient(135deg, #00b894, #55efc4)",
    claimed: false
  }
];

// Initialize the page
async function initialize() {
  console.log("Initializing rewards page...");
  
  // Check if wallet is connected
  await checkWalletConnection();
  
  // Render the UI based on connection state
  renderUI();
}

// Check if wallet is connected
>>>>>>> 6d6b6d551b39dbffcde826835191e7f6d9db0e9b
