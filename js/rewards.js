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
