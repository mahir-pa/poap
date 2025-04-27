const CONTRACT_ADDRESS = "0xBFdD9B4082BFaa9203fDda96aaF6420ef70772f2"; 
const ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

let provider, signer, contract, userAddress;
let currentRewardButton = null;
let confettiCanvasLoaded = false;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  updateRewards();
}

async function updateRewards() {
  if (!contract) return;

  try {
    const balance = await contract.balanceOf(userAddress);
    const numCollectibles = balance.toNumber();
    console.log("NFTs Owned:", numCollectibles);

    // Update T-shirt reward
    const tshirtButton = document.querySelectorAll('.reward-button')[0];
    if (numCollectibles >= 5) {
      tshirtButton.disabled = false;
      tshirtButton.classList.remove('locked');
      tshirtButton.classList.add('unlocked');
      tshirtButton.innerText = 'Claim Now';
      tshirtButton.onclick = () => claimReward(tshirtButton, 'Concert T-Shirt');
    } else {
      tshirtButton.disabled = true;
      tshirtButton.classList.remove('unlocked');
      tshirtButton.classList.add('locked');
      tshirtButton.innerText = `${numCollectibles}/5 Concerts Attended`;
    }

    // Update Hoodie reward
    const hoodieButton = document.querySelectorAll('.reward-button')[1];
    if (numCollectibles >= 10) {
      hoodieButton.disabled = false;
      hoodieButton.classList.remove('locked');
      hoodieButton.classList.add('unlocked');
      hoodieButton.innerText = 'Claim Now';
      hoodieButton.onclick = () => claimReward(hoodieButton, 'Concert Hoodie');
    } else {
      hoodieButton.disabled = true;
      hoodieButton.classList.remove('unlocked');
      hoodieButton.classList.add('locked');
      hoodieButton.innerText = `${numCollectibles}/10 Concerts Attended`;
    }

  } catch (err) {
    console.error(err);
  }
}

function claimReward(button, rewardName) {
  const popup = document.getElementById('reward-popup');
  const popupContent = document.getElementById('reward-popup-content');

  popup.style.display = 'flex';
  popupContent.innerHTML = `
    <h2 style="color:black;">🎉 Congratulations! 🎉</h2>
    <p style="color:black;">You are eligible for <strong>${rewardName}</strong>!</p>
    <input type="email" id="emailInput" placeholder="Enter your email" style="padding:8px;margin:10px 0;width:100%;border-radius:6px;">
    <button onclick="submitEmail()" style="padding:8px 16px;margin-top:10px;background:#6c5ce7;color:white;border:none;border-radius:6px;cursor:pointer;">Submit</button>
  `;

  currentRewardButton = button;
  startConfetti();
}

function submitEmail() {
  const email = document.getElementById('emailInput').value;
  if (!email.includes('@')) {
    alert("Please enter a valid email!");
    return;
  }

  const popupContent = document.getElementById('reward-popup-content');
  popupContent.innerHTML = `
    <h2 style="color:black;">✅ Thank you!</h2>
    <p style="color:black;">We will reach out to <strong>${email}</strong> soon!</p>
  `;

  startConfetti();

  setTimeout(() => {
    document.getElementById('reward-popup').style.display = 'none';
    if (currentRewardButton) {
      currentRewardButton.innerText = "Claimed ✅";
      currentRewardButton.disabled = true;
      currentRewardButton.classList.remove('unlocked');
      currentRewardButton.classList.add('locked');
    }
  }, 4000);
}

function startConfetti() {
  if (!confettiCanvasLoaded) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    script.onload = () => { confettiCanvasLoaded = true; fireConfetti(); };
    document.body.appendChild(script);
  } else {
    fireConfetti();
  }
}

function fireConfetti() {
  confetti({
    particleCount: 300,
    spread: 70,
    origin: { y: 0.6 }
  });
}

window.onload = connectWallet;
