import React, { useState } from 'react';
import { Screen } from './components/Screen.jsx';
import { WalletScreen } from './screens/WalletScreen.jsx';
import { AmountScreen } from './screens/AmountScreen.jsx';
import { NoteScreen } from './screens/NoteScreen.jsx';
import { ReviewScreen } from './screens/ReviewScreen.jsx';
import { QRScreen } from './screens/QRScreen.jsx';
import { ProcessingScreen } from './screens/ProcessingScreen.jsx';
import { GroupScreen } from './screens/GroupScreen.jsx';
import { ExpenseScreen } from './screens/ExpenseScreen.jsx';
import SplitDetailsScreen from './screens/SplitDetailsScreen.jsx';
import { NewGroupScreen } from './screens/NewGroupScreen.jsx';
import { useGroups } from './hooks/useGroups.js';
import { Celebrations } from './components/Celebrations.jsx';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('wallet');
  const [transactionType, setTransactionType] = useState('send');
  const [transactionAmount, setTransactionAmount] = useState(null);
  const [transactionNote, setTransactionNote] = useState('');
  
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expense, setExpense] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    addBill,
    updateBill,
    deleteBill,
    addMember,
    removeMember
  } = useGroups();

  const navigate = (screen) => {
    console.log('Navigating to:', screen);
    setActiveScreen(screen);
  };

  const handleBack = () => {
    console.log('Going back from:', activeScreen);
    if (activeScreen === 'amount') navigate('wallet');
    if (activeScreen === 'note') navigate('amount');
    if (activeScreen === 'review') navigate('note');
    if (activeScreen === 'qr') navigate('note');
    if (activeScreen === 'group') navigate('wallet');
    if (activeScreen === 'expense') navigate('group');
    if (activeScreen === 'splitDetails') navigate('group');
    if (activeScreen === 'newGroup') navigate('group');
  };

  const handleDeleteBill = (groupId, billId) => {
    deleteBill(groupId, billId);
  };

  const handleUpdateBill = (groupId, billId, updatedData) => {
    updateBill(groupId, billId, updatedData);
  };

  const handleContinue = (data) => {
    console.log('Continue with data:', data, 'from screen:', activeScreen);
    if (activeScreen === 'wallet') {
      setTransactionType(data);
      if (data === 'split') {
        navigate('group');
      } else {
        navigate('amount');
      }
    } else if (activeScreen === 'group') {
      if (data.id === 'new') {
        navigate('newGroup');
      } else {
        setSelectedGroup(data);
        if (data.selectedBill) {
          setSelectedBill(data.selectedBill);
          navigate('splitDetails');
        } else {
          navigate('expense');
        }
      }
    } else if (activeScreen === 'newGroup') {
      const newGroup = { ...data, bills: [] };
      addGroup(newGroup);
      setSelectedGroup(newGroup);
      navigate('expense');
    } else if (activeScreen === 'expense') {
      const newBill = {
        amount: data.amount,
        description: data.description || 'No description',
        date: 'Today',
        settled: false
      };
      addBill(selectedGroup.id, newBill);
      navigate('group');
    } else if (activeScreen === 'splitDetails') {
      if (selectedBill) {
        updateBill(selectedGroup.id, selectedBill.id, { ...selectedBill, settled: true });
      }
      setShowConfetti(true);
      navigate('processing');
      setTimeout(() => {
        setShowConfetti(false);
        navigate('wallet');
      }, 2000);
    } else if (activeScreen === 'amount') {
      setTransactionAmount(data);
      navigate('note');
    } else if (activeScreen === 'note') {
      setTransactionNote(data);
      if (transactionType === 'request') navigate('qr');
      else navigate('review');
    }
  };

  const handleComplete = () => {
    console.log('Completing transaction');
    setShowConfetti(true);
    navigate('processing');
    setTimeout(() => {
      setShowConfetti(false);
      navigate('wallet');
    }, 2000);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-black text-white">
      <Screen isActive={activeScreen === 'wallet'}>
        <WalletScreen onNavigate={handleContinue} />
      </Screen>

      <Screen isActive={activeScreen === 'amount'}>
        <AmountScreen
          type={transactionType}
          balance={15462.10}
          onBack={handleBack}
          onContinue={handleContinue}
        />
      </Screen>

      <Screen isActive={activeScreen === 'note'}>
        <NoteScreen
          type={transactionType}
          amount={transactionAmount}
          onBack={handleBack}
          onContinue={handleContinue}
        />
      </Screen>

      <Screen isActive={activeScreen === 'review'}>
        <ReviewScreen
          amount={transactionAmount}
          note={transactionNote}
          onBack={handleBack}
          onComplete={handleComplete}
        />
      </Screen>

      <Screen isActive={activeScreen === 'qr'}>
        <QRScreen
          amount={transactionAmount}
          note={transactionNote}
          onBack={handleBack}
          onClose={() => navigate('wallet')}
        />
      </Screen>

      <Screen isActive={activeScreen === 'processing'}>
        <ProcessingScreen
          type={transactionType === 'send' ? 'Sending' : 'Requesting'}
          amount={transactionAmount}
          onClose={() => navigate('wallet')}
        />
      </Screen>

      <Screen isActive={activeScreen === 'group'}>
        <GroupScreen
          groups={groups}
          onBack={handleBack}
          onContinue={handleContinue}
          onDeleteGroup={deleteGroup}
          onDeleteBill={handleDeleteBill}
          onUpdateBill={handleUpdateBill}
        />
      </Screen>

      <Screen isActive={activeScreen === 'expense'}>
        <ExpenseScreen
          group={selectedGroup}
          onBack={handleBack}
          onContinue={handleContinue}
        />
      </Screen>

      <Screen isActive={activeScreen === 'splitDetails'}>
        <SplitDetailsScreen
          group={selectedGroup}
          expense={expense}
          bill={selectedBill}
          onBack={handleBack}
          onContinue={handleContinue}
          onUpdateBill={(billData) => updateBill(selectedGroup.id, selectedBill.id, billData)}
        />
      </Screen>

      <Screen isActive={activeScreen === 'newGroup'}>
        <NewGroupScreen
          onBack={handleBack}
          onComplete={handleContinue}
        />
      </Screen>

      <Celebrations isActive={showConfetti} />
    </div>
  );
}
