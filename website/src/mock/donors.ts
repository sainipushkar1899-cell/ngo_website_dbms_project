/* ─────────────────────────────────────────────────────────────────────────────
   Mock Donors — matches MySQL `donors` table schema
   Fields: donor_id, donor_name, email, phone
   ───────────────────────────────────────────────────────────────────────────── */

export interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone: string;
}

export const donors: Donor[] = [
  {
    donor_id: 1,
    donor_name: "Priya Venkataraman",
    email: "priya.venkataraman@gmail.com",
    phone: "+91 98450 11203",
  },
  {
    donor_id: 2,
    donor_name: "Arjun Mehta",
    email: "arjun.mehta@infosys.com",
    phone: "+91 99200 34567",
  },
  {
    donor_id: 3,
    donor_name: "Sunita & Rakesh Agarwal",
    email: "agarwal.family@agarwalgroup.in",
    phone: "+91 98110 76543",
  },
  {
    donor_id: 4,
    donor_name: "Dr. Kavitha Nair",
    email: "kavitha.nair@aiims.edu",
    phone: "+91 94450 88012",
  },
  {
    donor_id: 5,
    donor_name: "Sameer Qureshi",
    email: "s.qureshi@tatagroup.com",
    phone: "+91 97320 44100",
  },
  {
    donor_id: 6,
    donor_name: "Ananya Krishnamurthy",
    email: "ananya.k@wipro.com",
    phone: "+91 90000 23456",
  },
  {
    donor_id: 7,
    donor_name: "Vikram & Deepa Bose",
    email: "vikrambose@gmail.com",
    phone: "+91 98300 65432",
  },
  {
    donor_id: 8,
    donor_name: "Rina Patel",
    email: "rina.patel@reliancefoundation.org",
    phone: "+91 93720 19283",
  },
  {
    donor_id: 9,
    donor_name: "Manoj Thakur",
    email: "manojthakur.ngo@outlook.com",
    phone: "+91 85550 72910",
  },
  {
    donor_id: 10,
    donor_name: "Geeta Iyer",
    email: "geetaiyer.csr@hdfc.com",
    phone: "+91 91001 34892",
  },
];

export default donors;
