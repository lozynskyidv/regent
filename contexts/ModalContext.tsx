/**
 * Modal Context
 * Centralized modal state management for the entire app
 * Prevents code duplication across screens
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AssetType, LiabilityType, Asset, Liability } from '../types';

// Modal imports
import AssetTypePickerModal from '../components/AssetTypePickerModal';
import AddBankModal from '../components/AddBankModal';
import AddPropertyModal from '../components/AddPropertyModal';
import AddOtherAssetModal from '../components/AddOtherAssetModal';
import LiabilityTypePickerModal from '../components/LiabilityTypePickerModal';
import AddMortgageModal from '../components/AddMortgageModal';
import AddLoanModal from '../components/AddLoanModal';
import AddOtherLiabilityModal from '../components/AddOtherLiabilityModal';
import EditAssetModal from '../components/EditAssetModal';
import EditLiabilityModal from '../components/EditLiabilityModal';

interface ModalContextType {
  // Asset modals
  openAddAssetFlow: () => void;
  openEditAsset: (asset: Asset) => void;
  
  // Liability modals
  openAddLiabilityFlow: () => void;
  openEditLiability: (liability: Liability) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  // Asset modal states
  const [showAssetTypePicker, setShowAssetTypePicker] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showOtherAssetModal, setShowOtherAssetModal] = useState(false);
  
  // Liability modal states
  const [showLiabilityTypePicker, setShowLiabilityTypePicker] = useState(false);
  const [showMortgageModal, setShowMortgageModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showOtherLiabilityModal, setShowOtherLiabilityModal] = useState(false);

  // Edit modal states
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showEditLiabilityModal, setShowEditLiabilityModal] = useState(false);
  const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null);

  // Public API - Asset Actions
  const openAddAssetFlow = () => {
    setShowAssetTypePicker(true);
  };

  const openEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowEditAssetModal(true);
  };

  // Public API - Liability Actions
  const openAddLiabilityFlow = () => {
    setShowLiabilityTypePicker(true);
  };

  const openEditLiability = (liability: Liability) => {
    setSelectedLiability(liability);
    setShowEditLiabilityModal(true);
  };

  // Handle asset type selection (step 1 → step 2)
  const handleAssetTypeSelect = (type: AssetType) => {
    switch (type) {
      case 'bank':
        setShowBankModal(true);
        break;
      case 'property':
        setShowPropertyModal(true);
        break;
      case 'portfolio':
        // TODO: Add portfolio modal when implementing stock tracking
        console.log('Portfolio modal coming soon');
        break;
      case 'other':
        setShowOtherAssetModal(true);
        break;
    }
  };

  // Handle liability type selection (step 1 → step 2)
  const handleLiabilityTypeSelect = (type: LiabilityType) => {
    switch (type) {
      case 'mortgage':
        setShowMortgageModal(true);
        break;
      case 'loan':
        setShowLoanModal(true);
        break;
      case 'creditcard':
        // TODO: Add credit card modal with TrueLayer integration
        console.log('Credit card modal coming soon');
        break;
      case 'other':
        setShowOtherLiabilityModal(true);
        break;
    }
  };

  const value: ModalContextType = {
    openAddAssetFlow,
    openEditAsset,
    openAddLiabilityFlow,
    openEditLiability,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}

      {/* Asset Type Picker Modal - Step 1 */}
      <AssetTypePickerModal
        visible={showAssetTypePicker}
        onClose={() => setShowAssetTypePicker(false)}
        onSelectType={handleAssetTypeSelect}
      />

      {/* Asset-specific Modals - Step 2 */}
      <AddBankModal
        visible={showBankModal}
        onClose={() => setShowBankModal(false)}
      />

      <AddPropertyModal
        visible={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
      />

      <AddOtherAssetModal
        visible={showOtherAssetModal}
        onClose={() => setShowOtherAssetModal(false)}
      />

      {/* Liability Type Picker Modal - Step 1 */}
      <LiabilityTypePickerModal
        visible={showLiabilityTypePicker}
        onClose={() => setShowLiabilityTypePicker(false)}
        onSelectType={handleLiabilityTypeSelect}
      />

      {/* Liability-specific Modals - Step 2 */}
      <AddMortgageModal
        visible={showMortgageModal}
        onClose={() => setShowMortgageModal(false)}
      />

      <AddLoanModal
        visible={showLoanModal}
        onClose={() => setShowLoanModal(false)}
      />

      <AddOtherLiabilityModal
        visible={showOtherLiabilityModal}
        onClose={() => setShowOtherLiabilityModal(false)}
      />

      {/* Edit Modals */}
      <EditAssetModal
        visible={showEditAssetModal}
        onClose={() => {
          setShowEditAssetModal(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
      />

      <EditLiabilityModal
        visible={showEditLiabilityModal}
        onClose={() => {
          setShowEditLiabilityModal(false);
          setSelectedLiability(null);
        }}
        liability={selectedLiability}
      />
    </ModalContext.Provider>
  );
}

// Custom hook for easy access
export function useModals() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
}
