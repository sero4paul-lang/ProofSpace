import { jsPDF } from 'jspdf';
import { Profile, Proof, Milestone } from '../types';

export const exportPortfolioToPDF = (profile: Profile, proofs: Proof[], milestones: Milestone[]) => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = margin;

  // Header - Profile Info
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.name || 'Anonymous Builder', margin, yPos);
  yPos += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`@${profile.username || 'username'} | ${profile.focus}`, margin, yPos);
  yPos += 15;

  doc.setFontSize(12);
  doc.setTextColor(0);
  const bioLines = doc.splitTextToSize(profile.bio || 'No bio provided.', 170);
  doc.text(bioLines, margin, yPos);
  yPos += (bioLines.length * 7) + 15;

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, yPos - 5, 190, yPos - 5);

  // Sections: Technical Proofs
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Contribution Proofs', margin, yPos);
  yPos += 10;

  if (proofs.length === 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('No proofs documented yet.', margin, yPos);
    yPos += 10;
  } else {
    proofs.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.timestamp - a.timestamp).forEach((proof) => {
      if (yPos > 260) { doc.addPage(); yPos = margin; }

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(106, 13, 173);
      doc.text(`${proof.category.toUpperCase()}${proof.pinned ? ' • FEATURED' : ''}`, margin, yPos);
      yPos += 5;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(proof.title, margin, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150);
      doc.text(new Date(proof.timestamp).toLocaleDateString(), margin, yPos);
      yPos += 6;

      doc.setFontSize(11);
      doc.setTextColor(50);
      const descLines = doc.splitTextToSize(proof.description, 170);
      doc.text(descLines, margin, yPos);
      yPos += (descLines.length * 6) + 5;

      if (proof.link) {
        doc.setFontSize(10);
        doc.setTextColor(30, 144, 255);
        doc.text(`Verification Link: ${proof.link}`, margin, yPos);
        yPos += 7;
      }

      yPos += 8;
    });
  }

  // Sections: Journey Timeline
  if (milestones.length > 0) {
    if (yPos > 200) { doc.addPage(); yPos = margin; }
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Journey Timeline', margin, yPos);
    yPos += 10;

    milestones.sort((a, b) => b.timestamp - a.timestamp).forEach((m) => {
      if (yPos > 260) { doc.addPage(); yPos = margin; }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(m.title, margin, yPos);
      yPos += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(new Date(m.timestamp).toLocaleDateString(), margin, yPos);
      yPos += 5;

      doc.setFontSize(10);
      doc.setTextColor(80);
      const mLines = doc.splitTextToSize(m.description, 170);
      doc.text(mLines, margin, yPos);
      yPos += (mLines.length * 5) + 10;
    });
  }

  // Footer - Page Numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(180);
    doc.text(`ProofSpace Builder Profile | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }

  doc.save(`${profile.username || 'portfolio'}_identity.pdf`);
};
