
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE SPLoadPODetailsByPONumber
	@PO VARCHAR(50)=''
AS
BEGIN
	SELECT WH  WarehouseCode,'' ConsigneeCode,PONUM PoNumber,airport OriginPortCode,'MIA' DestinationPortCode,PODATE EstimatedDate,'' Comments,'FINAL' PostType FROM F_POH WHERE PONUM=@PO

	SELECT '' ShipToCode ,FARM FarmCode,'' CarrierCode,'' DispatchDate,
	FARM+CASE WHEN LEN(BOXNUM)=0 THEN '00000' WHEN LEN(BOXNUM)=1 THEN '0000' WHEN LEN(BOXNUM)=2 THEN '000' WHEN LEN(BOXNUM)=3 THEN '00' 
	WHEN LEN(BOXNUM)=4 THEN '0' WHEN LEN(BOXNUM)=5 THEN '' END + BOXNUM AS Barcode
	,UOM AS BoxSize,PRODCODQ AS ProductCode,PRODNAMQ AS ProductDescription,
	qtyxbox Packing,UNITCOSQ AS UnitPrice, LENGHT Length,WIDTH Width,HEIGHT Hight,0 as GrossWeight, UOM AS UnitOfMeasurement, '' Comments
	FROM F_POQ WHERE PONUM=@PO
END
GO
