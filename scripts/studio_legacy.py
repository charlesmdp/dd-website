"""The existing tools keep their URLs and processors, inside the new library."""
from studio_catalog import add

def register():
    add('pdfmark','files','pdf-watermark','PDF watermark tool','Watermark a PDF',
        'Stamp a text watermark onto every page of an ebook or printable PDF. Adjust placement and opacity and download a marked copy.',
        'Watermark PDF','Watermarked PDF','personal-use-copy.pdf',
        ['Choose an unlocked PDF.', 'Enter the watermark and choose a diagonal or footer placement.', 'Save the marked copy and check its legibility.'],
        'A visible watermark can discourage casual sharing. This tool applies the same wording to every page. BIG’s in-app PDF stamping can personalise files for individual orders.',
        'Use a light diagonal “Preview copy” for a sample chapter. For a finished workbook, a small footer keeps the exercise area clear.',
        [('Does a watermark stop copying?', 'No. A visible mark does not encrypt the document or prevent screenshots.'),('Can I stamp a different buyer name on each copy?', 'Enter one name per run. For automatic per-order stamping, configure PDF stamping in BIG instead.'),('What files and text can I use?', 'Choose an unlocked PDF up to 50 MiB and a short Latin-character watermark. The original file is not overwritten.')], 'extract number','/sell-pdfs-on-shopify')
    add('merge','files','merge-pdf','PDF merger','Merge PDFs',
        'Combine PDFs into one download and set the order before saving. Useful for a workbook with a separate cover, exercises and answer sheets.',
        'Merge PDFs','Combined PDF','complete-workbook.pdf',
        ['Choose two or more PDF files at once.', 'Move each file into the reading order you want.', 'Merge and verify the combined document.'],
        'Open the merged file as a buyer would. Check the cover, transitions between sections and page orientation. Merging pages does not design a new table of contents.',
        'A one-page cover followed by a four-page workbook produces one five-page PDF, with the original pages in that order.',
        [('Can I change the file order?', 'Yes. Use the move up and move down controls before merging.'),('What is the file limit?', 'Choose between two and twenty unlocked PDFs, with a combined size of up to 50 MiB.'),('What happens to signatures and forms?', 'The tool copies pages. Document-level forms, digital signatures, attachments and bookmarks may not survive the merge.')], 'number pdfmark','/sell-ebooks-on-shopify')
    add('bandwidth','files','bandwidth-calculator','Download bandwidth calculator','Estimate monthly bandwidth',
        'Estimate monthly transfer for a digital download catalogue and compare it with BIG’s listed paid-plan capacity.',
        'Estimate my usage','Monthly transfer','150 GB / month',
        ['Enter average file size and monthly orders.', 'Allow for repeat downloads and enter total catalogue storage.', 'Review the estimate and confirm current billing terms in the app.'],
        'Storage measures what sits on the shelf. Bandwidth measures what is delivered. Two catalogues of the same size can use very different amounts of transfer if one product sells more often.',
        'A 100 MB file delivered 1.5 times for each of 1,000 orders transfers roughly 150 GB in decimal units.',
        [('Are storage and bandwidth added together?', 'No. The tool checks both limits separately when comparing paid-plan capacity.'),('Is the result an invoice?', 'No. It is a scenario based on the inputs and the listed plan assumptions. Confirm your actual subscription and any overages in the app.'),('Does this include the free plan?', 'No. The plan comparison estimates paid-plan capacity only. The transfer calculation itself is independent of the plan.')], 'download zip','/features')
    add('qr','launch','custom-qr-code-generator','QR code generator','Create a QR code',
        'Turn a public product link into a downloadable SVG QR code for an insert, printable guide or launch poster.',
        'Create QR code','Scalable QR code','product-link.svg',
        ['Paste the public link or text to encode.', 'Generate the code and scan the preview on a phone.', 'Download the SVG, keeping the white margin around the code.'],
        'Use a stable public destination you control. A printed QR code keeps the original encoded value. Changing your product URL later will not rewrite the code on an existing insert.',
        'Encode a campaign-tagged product link for a package insert. Test the exported artwork again at the final printed size.',
        [('Does the code expire?', 'The SVG has no expiry date. The destination can still stop working if the page is removed or moved.'),('Can I see scan statistics?', 'The generator does not count scans. Use a tagged destination with your own analytics to measure visits.'),('Can I put a customer download link on a poster?', 'Use a public product page instead. A private fulfilment link may grant access to a file that should be limited to a buyer.')], 'utm canva','/features')
    add('numeric','catalog','custom-bulk-number-generator','Bulk number generator','Generate numeric codes',
        'Generate a batch of unique random numeric identifiers. Choose the length and an optional prefix, then export the values as CSV.',
        'Generate codes','Numeric code CSV','100 unique codes',
        ['Choose the number and length of identifiers.', 'Add a prefix if you need to distinguish this release.', 'Import the CSV column as text if you need to preserve leading zeroes.'],
        'A numeric ID can label a giveaway entry or a print edition. If your spreadsheet automatically treats the column as numbers, leading zeroes can disappear. Choose a text column during import.',
        'With the prefix ART- and six digits, a value looks like ART-004216. A fresh run creates a new batch rather than restoring the previous one.',
        [('Are values unique across every session?', 'They are unique within one generated batch. Check against historical batches yourself.'),('Does generating a code create a discount?', 'No. These are identifiers only. A store or redemption system must separately accept them.'),('How large can my batch be?', 'Choose up to 5,000 codes, with four to twenty-four digits per code.')], 'license sku','/sell-license-keys-on-shopify')
    add('revenue','catalog','revenue-calculator','Digital product revenue calculator','Estimate monthly revenue',
        'Model monthly contribution from digital product sales after discounts, percentage fees, per-order fees and fixed monthly costs.',
        'Calculate contribution','Monthly contribution','Sales less fees and costs',
        ['Enter price, monthly order count and typical discount.', 'Use your own fees rather than assuming that the example is your rate.', 'Compare revenue, total fees and the remaining contribution.'],
        'This scenario assumes the same average price and discount on every sale. Refunds, taxes, acquisition expenses and production costs are not automatically modelled. Include relevant fixed expenses if you want to test their effect.',
        'At $25 and 100 orders, undiscounted sales are $2,500. With the example 2.9% + $0.30 fee and $9.99 fixed cost, $2,387.51 remains before other expenses.',
        [('Is this take-home profit?', 'No. It is contribution after the costs you entered. It is not a tax or accounting statement.'),('Is the payment fee fixed by BIG?', 'No. The percentage and per-order fees are editable examples. Use the rates that apply to your own payment setup.'),('Can the result be negative?', 'Yes. If costs exceed discounted sales, the result shows the shortfall.')], 'price breakeven','/features')
