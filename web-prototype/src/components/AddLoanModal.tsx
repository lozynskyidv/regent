import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (loan: { name: string; value: number; details: LoanDetails }) => void;
  initialData?: { name: string; value: number; details?: LoanDetails } | null;
}

interface LoanDetails {
  type: string;
  lender: string;
  interestRate: string;
  monthlyPayment: string;
}

export function AddLoanModal({ isOpen, onClose, onAdd, initialData }: AddLoanModalProps) {
  const [loanType, setLoanType] = useState<'Personal' | 'Car' | 'Student' | ''>('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [lender, setLender] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setLoanType((initialData.details?.type as 'Personal' | 'Car' | 'Student') || '');
      setLender(initialData.details?.lender || '');
      setOutstandingBalance(initialData.value.toString());
      setInterestRate(initialData.details?.interestRate || '');
      setMonthlyPayment(initialData.details?.monthlyPayment || '');
    } else {
      setLoanType('');
      setLender('');
      setOutstandingBalance('');
      setInterestRate('');
      setMonthlyPayment('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const loanTypes: Array<'Personal' | 'Car' | 'Student'> = ['Personal', 'Car', 'Student'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const balance = parseFloat(outstandingBalance.replace(/,/g, ''));
    
    if (!loanType || !lender || isNaN(balance) || balance <= 0) {
      return;
    }

    onAdd({
      name: `${loanType} Loan - ${lender}`,
      value: balance,
      details: {
        type: loanType,
        lender,
        interestRate,
        monthlyPayment
      }
    });

    // Reset form
    setLoanType('');
    setLender('');
    setOutstandingBalance('');
    setInterestRate('');
    setMonthlyPayment('');
  };

  const formatNumberInput = (value: string) => {
    const num = value.replace(/,/g, '');
    if (!num) return '';
    return parseFloat(num).toLocaleString('en-GB');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal */}
      <div 
        className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-2xl flex flex-col sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-[393px]"
        style={{
          maxHeight: '85vh',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 border-b flex-shrink-0"
          style={{
            paddingTop: '20px',
            paddingBottom: '20px',
            borderColor: 'var(--border)'
          }}
        >
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-lg transition-all active:scale-95"
            style={{ color: 'var(--foreground)' }}
          >
            <X size={24} strokeWidth={2} />
          </button>
          
          <h2 
            style={{
              fontSize: '1.0625rem',
              fontWeight: 500,
              letterSpacing: '-0.01em'
            }}
          >
            Add Loan
          </h2>
          
          <button
            onClick={handleSubmit}
            disabled={!loanType || !lender || !outstandingBalance}
            className="transition-all active:scale-95 disabled:opacity-40"
            style={{
              fontSize: '1.0625rem',
              fontWeight: 500,
              color: 'var(--primary)'
            }}
          >
            Add
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div 
            className="px-6 py-6 space-y-6"
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom) + 24px, 24px)'
            }}
          >
            {/* Loan Type Dropdown */}
            <div>
              <label 
                className="block mb-2"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Loan Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full px-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
                  style={{
                    height: '56px',
                    fontSize: '1rem',
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: loanType ? 'var(--foreground)' : 'var(--muted-foreground)',
                    textAlign: 'left'
                  }}
                >
                  <span>{loanType || 'Select type'}</span>
                  <ChevronDown size={20} strokeWidth={2} />
                </button>

                {/* Dropdown Menu */}
                {showTypeDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg overflow-hidden z-10"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    {loanTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setLoanType(type);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full px-4 py-3 transition-all hover:bg-secondary text-left"
                        style={{
                          fontSize: '1rem',
                          color: 'var(--foreground)'
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lender */}
            <div>
              <label 
                htmlFor="lender"
                className="block mb-2"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Lender
              </label>
              <input
                id="lender"
                type="text"
                value={lender}
                onChange={(e) => setLender(e.target.value)}
                placeholder="e.g., Santander"
                className="w-full px-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{
                  height: '56px',
                  fontSize: '1rem',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Outstanding Balance */}
            <div>
              <label 
                htmlFor="outstandingBalance"
                className="block mb-2"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Outstanding Balance
              </label>
              <div className="relative">
                <span 
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  £
                </span>
                <input
                  id="outstandingBalance"
                  type="text"
                  value={outstandingBalance}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setOutstandingBalance(value ? formatNumberInput(value) : '');
                  }}
                  placeholder="0"
                  className="w-full pl-8 pr-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  style={{
                    height: '56px',
                    fontSize: '1rem',
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>

            {/* Interest Rate (Optional) */}
            <div>
              <label 
                htmlFor="interestRate"
                className="block mb-2"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Interest Rate <span style={{ color: 'var(--muted-foreground)' }}>(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="interestRate"
                  type="text"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g., 5.5"
                  className="w-full pl-4 pr-10 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  style={{
                    height: '56px',
                    fontSize: '1rem',
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                />
                <span 
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  %
                </span>
              </div>
            </div>

            {/* Monthly Payment (Optional) */}
            <div>
              <label 
                htmlFor="monthlyPayment"
                className="block mb-2"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Monthly Payment <span style={{ color: 'var(--muted-foreground)' }}>(optional)</span>
              </label>
              <div className="relative">
                <span 
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  £
                </span>
                <input
                  id="monthlyPayment"
                  type="text"
                  value={monthlyPayment}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setMonthlyPayment(value ? formatNumberInput(value) : '');
                  }}
                  placeholder="0"
                  className="w-full pl-8 pr-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  style={{
                    height: '56px',
                    fontSize: '1rem',
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(100%);
          }
          to { 
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}