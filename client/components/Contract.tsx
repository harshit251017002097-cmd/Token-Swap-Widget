"use client";

import { useState, useCallback } from "react";
import { swapTokens, CONTRACT_ADDRESS } from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M21 3l-7 7" />
      <path d="M21 14v7h-5" />
      <path d="M21 21l-7-7" />
      <path d="M3 16v5h5" />
      <path d="M3 21l7-7" />
      <path d="M3 7V3h5" />
      <path d="M3 3l7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  color,
}: {
  name: string;
  params: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Form state
  const [user2Address, setUser2Address] = useState("");
  const [token1Address, setToken1Address] = useState("");
  const [token2Address, setToken2Address] = useState("");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleSwap = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!user2Address.trim()) return setError("Enter counterparty address");
    if (!token1Address.trim() || !token2Address.trim()) return setError("Enter both token addresses");
    if (!amount1.trim() || !amount2.trim()) return setError("Enter swap amounts");

    // Basic address validation
    if (!user2Address.startsWith("G") || user2Address.length !== 56) {
      return setError("Invalid counterparty address");
    }
    if (!token1Address.startsWith("C") || token1Address.length !== 56) {
      return setError("Invalid token1 address (must be contract address)");
    }
    if (!token2Address.startsWith("C") || token2Address.length !== 56) {
      return setError("Invalid token2 address (must be contract address)");
    }

    setError(null);
    setIsSwapping(true);
    setTxStatus("Awaiting signature...");

    try {
      // Convert amounts to bigint (assuming 7 decimal places for typical tokens)
      const amount1Big = BigInt(Math.floor(parseFloat(amount1) * 10000000));
      const amount2Big = BigInt(Math.floor(parseFloat(amount2) * 10000000));

      if (amount1Big <= 0 || amount2Big <= 0) {
        throw new Error("Amounts must be greater than 0");
      }

      await swapTokens(
        walletAddress,
        walletAddress,        // user1 = caller
        user2Address.trim(),  // user2 = counterparty
        token1Address.trim(), // token1 = what user1 gives
        token2Address.trim(), // token2 = what user1 receives
        amount1Big,
        amount2Big
      );

      setTxStatus("Swap completed on-chain!");
      // Clear amounts only, keep addresses for convenience
      setAmount1("");
      setAmount2("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsSwapping(false);
    }
  }, [walletAddress, user2Address, token1Address, token2Address, amount1, amount2]);

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("completed") || txStatus.includes("on-chain") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#f472b6]/20 border border-white/[0.06]">
                <SwapIcon />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Token Swap Widget</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <div className="space-y-5">
              <MethodSignature 
                name="swap" 
                params="(user1, user2, token1, token2, amount1, amount2)" 
                color="#f472b6" 
              />

              {/* Your Address (read-only) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
                  Your Address (You)
                </label>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 font-mono text-sm text-white/50">
                  {walletAddress ? (
                    <span className="text-white/80">{walletAddress}</span>
                  ) : (
                    <span className="text-white/20">Connect wallet to start</span>
                  )}
                </div>
              </div>

              {/* Counterparty */}
              <Input 
                label="Counterparty Address (User 2)" 
                value={user2Address} 
                onChange={(e) => setUser2Address(e.target.value)} 
                placeholder="G..."
              />

              {/* Token 1 (You Give) */}
              <div className="space-y-3">
                <Input 
                  label="Token 1 Address (You Give)" 
                  value={token1Address} 
                  onChange={(e) => setToken1Address(e.target.value)} 
                  placeholder="C... (contract address)"
                />
                <Input 
                  label="Amount 1" 
                  type="number"
                  step="0.0000001"
                  min="0"
                  value={amount1} 
                  onChange={(e) => setAmount1(e.target.value)} 
                  placeholder="0.0"
                />
              </div>

              {/* Swap Direction */}
              <div className="flex items-center justify-center py-1">
                <div className="flex items-center gap-2 text-white/20">
                  <ArrowDownIcon />
                  <span className="text-xs">You Give</span>
                  <span className="text-white/10">→</span>
                  <span className="text-xs">You Receive</span>
                  <ArrowUpIcon />
                </div>
              </div>

              {/* Token 2 (You Receive) */}
              <div className="space-y-3">
                <Input 
                  label="Token 2 Address (You Receive)" 
                  value={token2Address} 
                  onChange={(e) => setToken2Address(e.target.value)} 
                  placeholder="C... (contract address)"
                />
                <Input 
                  label="Amount 2" 
                  type="number"
                  step="0.0000001"
                  min="0"
                  value={amount2} 
                  onChange={(e) => setAmount2(e.target.value)} 
                  placeholder="0.0"
                />
              </div>

              {/* Swap Button */}
              {walletAddress ? (
                <ShimmerButton onClick={handleSwap} disabled={isSwapping} shimmerColor="#f472b6" className="w-full">
                  {isSwapping ? <><SpinnerIcon /> Swapping...</> : <><SwapIcon /> Execute Swap</>}
                </ShimmerButton>
              ) : (
                <button
                  onClick={onConnect}
                  disabled={isConnecting}
                  className="w-full rounded-xl border border-dashed border-[#f472b6]/20 bg-[#f472b6]/[0.03] py-4 text-sm text-[#f472b6]/60 hover:border-[#f472b6]/30 hover:text-[#f472b6]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  <WalletIcon className="inline mr-2" />
                  Connect wallet to swap tokens
                </button>
              )}

              {/* Info Box */}
              <div className="rounded-xl border border-[#4fc3f7]/10 bg-[#4fc3f7]/[0.02] px-4 py-3">
                <p className="text-[10px] text-[#4fc3f7]/60 leading-relaxed">
                  <strong className="text-[#4fc3f7]/80">How it works:</strong> This atomic swap exchanges tokens directly between two users. 
                  Both parties must authorize the transaction. Token addresses must be valid Soroban token contracts.
                  Amounts are in units of 10⁻⁷ (7 decimal places).
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Token Swap Widget &middot; Soroban</p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f472b6]" />
              <span className="font-mono text-[9px] text-white/15">Atomic Swap</span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
