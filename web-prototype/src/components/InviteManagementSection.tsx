import { Users, Copy, Share2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useState } from 'react';

interface InviteCode {
  code: string;
  used: boolean;
  usedBy?: string;
  usedAt?: string;
  expiresAt: string;
  createdAt: string;
}

interface InviteManagementSectionProps {
  invitesRemaining: number;
  generatedCodes: InviteCode[];
  onGenerateCode: () => Promise<void>;
  isGenerating: boolean;
}

/**
 * INVITE MANAGEMENT SECTION
 * 
 * Displays in SettingsScreen
 * Shows invites remaining, generate button, and list of codes
 * 
 * For React Native developers:
 * - Replace buttons with TouchableOpacity
 * - Use Clipboard.setString() for copy
 * - Use Share.share() for native share sheet
 * - Style with StyleSheet
 */
export function InviteManagementSection({
  invitesRemaining,
  generatedCodes,
  onGenerateCode,
  isGenerating
}: InviteManagementSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    // Fallback copy method for environments where Clipboard API is blocked
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      
      document.body.removeChild(textArea);
    };

    // Try modern Clipboard API first, fallback to execCommand
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedCode(code);
          setTimeout(() => setCopiedCode(null), 2000);
        })
        .catch(() => {
          // If Clipboard API fails, use fallback
          fallbackCopy(code);
        });
    } else {
      fallbackCopy(code);
    }
  };

  const handleShareCode = (code: string) => {
    // In React Native, use: Share.share({ message: `Join Regent with my invite: ${code}` })
    if (navigator.share) {
      navigator.share({
        text: `Join Regent with my invite code: ${code}\n\nRegent is an invite-only net worth tracker for professionals.`
      }).catch(err => {
        // If share fails, fallback to copy
        console.log('Share failed, copying instead:', err);
        handleCopyCode(code);
      });
    } else {
      // Fallback: just copy the code
      handleCopyCode(code);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    return `Expires in ${diffDays}d`;
  };

  return (
    <div>
      <h2 
        className="mb-4"
        style={{
          fontSize: '1.125rem',
          fontWeight: 500,
          color: 'var(--foreground)'
        }}
      >
        Invite Friends
      </h2>

      {/* Invites Remaining Card */}
      <div 
        className="p-5 rounded-xl border mb-4"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card)'
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-lg"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
              }}
            >
              <Users 
                size={20} 
                strokeWidth={2}
                style={{ color: 'var(--primary)' }}
              />
            </div>
            
            <div>
              <p 
                className="mb-1"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}
              >
                Invites Available
              </p>
              <p 
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.4
                }}
              >
                Share Regent with select friends
              </p>
            </div>
          </div>

          <div
            className="px-3 py-1.5 rounded-full"
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: invitesRemaining > 0 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(107, 114, 128, 0.1)',
              color: invitesRemaining > 0 
                ? 'var(--primary)' 
                : 'var(--muted-foreground)'
            }}
          >
            {invitesRemaining}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerateCode}
          disabled={invitesRemaining === 0 || isGenerating}
          className="w-full rounded-xl transition-all active:scale-[0.98]"
          style={{
            height: '48px',
            fontSize: '0.9375rem',
            fontWeight: 500,
            backgroundColor: invitesRemaining > 0 ? 'var(--primary)' : 'var(--muted)',
            color: invitesRemaining > 0 ? 'var(--background)' : 'var(--muted-foreground)',
            opacity: isGenerating ? 0.6 : 1,
            cursor: invitesRemaining === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Invite Code'}
        </button>

        {invitesRemaining === 0 && (
          <p 
            className="mt-3 text-center"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.4
            }}
          >
            You've used all your invites
          </p>
        )}
      </div>

      {/* Generated Codes List */}
      {generatedCodes.length > 0 && (
        <div>
          <h3 
            className="mb-3"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            Your Invite Codes
          </h3>

          <div className="space-y-3">
            {generatedCodes.map((invite) => (
              <div
                key={invite.code}
                className="p-4 rounded-xl border"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--card)'
                }}
              >
                {/* Code and Status Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <code
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        fontFamily: 'ui-monospace, monospace',
                        color: 'var(--foreground)',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {invite.code}
                    </code>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5">
                    {invite.used ? (
                      <>
                        <CheckCircle2 size={14} strokeWidth={2.5} style={{ color: 'rgb(34, 197, 94)' }} />
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'rgb(34, 197, 94)'
                          }}
                        >
                          Used
                        </span>
                      </>
                    ) : new Date(invite.expiresAt) < new Date() ? (
                      <>
                        <XCircle size={14} strokeWidth={2.5} style={{ color: 'rgb(239, 68, 68)' }} />
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'rgb(239, 68, 68)'
                          }}
                        >
                          Expired
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock size={14} strokeWidth={2.5} style={{ color: 'rgb(234, 179, 8)' }} />
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'rgb(234, 179, 8)'
                          }}
                        >
                          Pending
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-3">
                  {invite.used && invite.usedBy ? (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--muted-foreground)',
                        lineHeight: 1.4
                      }}
                    >
                      Used by <span style={{ fontWeight: 500 }}>{invite.usedBy}</span>
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--muted-foreground)',
                        lineHeight: 1.4
                      }}
                    >
                      {formatDate(invite.expiresAt)}
                    </p>
                  )}
                </div>

                {/* Action Buttons (only for unused, non-expired codes) */}
                {!invite.used && new Date(invite.expiresAt) >= new Date() && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyCode(invite.code)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg transition-all active:scale-[0.98]"
                      style={{
                        height: '40px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backgroundColor: copiedCode === invite.code 
                          ? 'rgba(34, 197, 94, 0.1)' 
                          : 'rgba(59, 130, 246, 0.1)',
                        color: copiedCode === invite.code 
                          ? 'rgb(34, 197, 94)' 
                          : 'var(--primary)'
                      }}
                    >
                      {copiedCode === invite.code ? (
                        <>
                          <CheckCircle2 size={16} strokeWidth={2} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} strokeWidth={2} />
                          Copy
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShareCode(invite.code)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg transition-all active:scale-[0.98]"
                      style={{
                        height: '40px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--primary)'
                      }}
                    >
                      <Share2 size={16} strokeWidth={2} />
                      Share
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedCodes.length === 0 && (
        <div 
          className="p-6 rounded-xl border text-center"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)',
            borderStyle: 'dashed'
          }}
        >
          <div
            className="mx-auto mb-3 p-3 rounded-full inline-flex"
            style={{
              backgroundColor: 'rgba(107, 114, 128, 0.1)'
            }}
          >
            <Users 
              size={24} 
              strokeWidth={2}
              style={{ color: 'var(--muted-foreground)' }}
            />
          </div>
          
          <p 
            className="mb-1"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--foreground)'
            }}
          >
            No Codes Generated Yet
          </p>
          <p 
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.4
            }}
          >
            Generate your first invite code to share Regent
          </p>
        </div>
      )}

      {/* Info Note */}
      <div 
        className="mt-4 p-4 rounded-xl"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderLeft: '3px solid var(--primary)'
        }}
      >
        <p 
          className="mb-1"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--foreground)'
          }}
        >
          About Invites
        </p>
        <p 
          style={{
            fontSize: '0.8125rem',
            color: 'var(--muted-foreground)',
            lineHeight: 1.5
          }}
        >
          Each code expires after 30 days and can only be used once. Share codes with trusted friends who value financial clarity.
        </p>
      </div>
    </div>
  );
}