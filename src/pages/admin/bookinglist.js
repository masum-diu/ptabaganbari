// ./src/pages/admin/bookinglist.js
import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Button, Chip, CircularProgress
} from "@mui/material";
import supabase from "@/lib/supabase";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.log("Fetch error:", error);
    } else {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Approve booking
  const approveBooking = async (trxID) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "approved" })
      .eq("trx_id", trxID);

    if (error) {
      console.log("Approve error:", error);
    } else {
      fetchBookings(); // refresh list
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        📋 Booking List (Admin)
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Persons</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>trxID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.phone}</TableCell>
                <TableCell>{b.persons}</TableCell>
                <TableCell>৳{b.total}</TableCell>
                <TableCell>{b.trx_id}</TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={b.status}
                    color={b.status === "approved" ? "success" : "warning"}
                  />
                </TableCell>

                {/* Action */}
                <TableCell>
                  {b.status === "pending" && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => approveBooking(b.trx_id)}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}