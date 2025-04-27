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