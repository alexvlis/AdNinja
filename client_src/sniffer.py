import pcapy

def main():
    cap = pcapy.open_live('en0' , 65536 , 1 , 0)

    #start sniffing packets
    print "Listening for packets..."
    while(1) :
        (header, packet) = cap.next()
        print 'Destination MAC : ' + eth_addr(packet[0:6]) + ' Source MAC : ' + eth_addr(packet[6:12])

def eth_addr (a) :
    b = "%.2x:%.2x:%.2x:%.2x:%.2x:%.2x" % (ord(a[0]) , ord(a[1]) , ord(a[2]), ord(a[3]), ord(a[4]) , ord(a[5]))
    return b

#start of main
if __name__ == "__main__":
  main()
