/****** Object:  Table [dbo].[zzzSBOrder]    Script Date: 8/5/2016 11:46:10 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[zzzSBOrder](
	[uId] [uniqueidentifier] NULL CONSTRAINT [DF_zzzSBOrder_uId]  DEFAULT (newid()),
	[OrderId] [int] IDENTITY(1,1) NOT NULL,
	[CustomerId] [int] NOT NULL,
	[OrderName] [nvarchar](100) NULL,
	[OrderNotes] [nvarchar](2000) NULL,
	[CustOrderId] [nvarchar](50) NULL,
	[CustPO] [nvarchar](50) NULL,
	[orderDt] [datetime] NULL,
	[estShipDt] [datetime] NULL,
	[dueInStoreDt] [datetime] NULL,
	[dispStartDt] [datetime] NULL,
	[dispEndDt] [datetime] NULL,
	[packBy] [int] NULL,
	[shipTo] [int] NULL,
	[billTo] [int] NULL,
	[status] [nvarchar](15) NOT NULL,
	[test] [bit] NULL,
	[CreatedBy] [int] NULL CONSTRAINT [DF_zzzSBOrder_Createdby]  DEFAULT ((0)),
	[CreatedOn] [datetime] NULL CONSTRAINT [DF_zzzSBOrder_CreatedOn]  DEFAULT (getdate()),
	[ModifiedBy] [int] NULL,
	[ModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_zzzSBOrder] PRIMARY KEY CLUSTERED 
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UX_zzzSBOrder] UNIQUE NONCLUSTERED 
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


/****** Object:  Table [dbo].[zSBPromotion]    Script Date: 8/5/2016 11:46:10 AM ******/
CREATE TABLE [dbo].[zzzSBPromotion](
	[uId] [uniqueidentifier] NULL CONSTRAINT [DF_zzzSBPromotion_uId]  DEFAULT (newid()),
	[PromoId] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[PromoText] [nvarchar](500) NULL,
	[PromoNotes] [nvarchar](2000) NULL,
	[estShipDt] [datetime] NULL,
	[dueInStoreDt] [datetime] NULL,
	[dispStartDt] [datetime] NULL,
	[dispEndDt] [datetime] NULL,
	[packBy] [int] NULL,
	[shipTo] [int] NULL,
	[billTo] [int] NULL,
	[CreatedBy] [int] NULL CONSTRAINT [DF_zzzSBPromotion_Createdby]  DEFAULT ((0)),
	[CreatedOn] [datetime] NULL CONSTRAINT [DF_zzzSBPromotion_CreatedOn]  DEFAULT (getdate()),
	[ModifiedBy] [int] NULL,
	[ModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_zzzSBPromotion] PRIMARY KEY CLUSTERED 
(
	[PromoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UX_zzzSBPromotion] UNIQUE NONCLUSTERED 
(
	[PromoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [FK_zzzSBPromotion_OrderId] FOREIGN KEY([OrderId])
	REFERENCES zzzSBOrder ([OrderId])
	ON DELETE CASCADE
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[zSBPromotion]    Script Date: 8/5/2016 11:46:10 AM ******/
CREATE TABLE [dbo].[zzzSBSign](
	[uId] [uniqueidentifier] NULL CONSTRAINT [DF_zzzSBSign_uId]  DEFAULT (newid()),
	[SignId] [int] IDENTITY(1,1) NOT NULL,
	[PromoId] [int] NULL,
	[signType] [int] NULL,
	[CustType] [int] NULL,
	[Stock] [int] NULL,
	[Stock2] [int] NULL,
	[Width] [numeric](8,3) NULL,
	[Height] [numeric](8,3) NULL,
	[Priority] [int] NULL,
	[Qty] [int] NULL,
	[packBy] [int] NULL,
	[shipTo] [int] NULL,
	[billTo] [int] NULL,
	[status] [nvarchar](15) NOT NULL,
	[SignNotes] [nvarchar](2000) NULL,
	[CreatedBy] [int] NULL CONSTRAINT [DF_zzzSBSign_Createdby]  DEFAULT ((0)),
	[CreatedOn] [datetime] NULL CONSTRAINT [DF_zzzSBSign_CreatedOn]  DEFAULT (getdate()),
	[ModifiedBy] [int] NULL,
	[ModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_zzzSBSign] PRIMARY KEY CLUSTERED 
(
	[SignId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UX_zzzSBSign] UNIQUE NONCLUSTERED 
(
	[SignId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [FK_zzzSBSign_PromoId] FOREIGN KEY([PromoId])
	REFERENCES zzzSBPromotion ([PromoId])
	ON DELETE CASCADE
) ON [PRIMARY]

CREATE TABLE [dbo].[zzzSBShipping](
	[uId] [uniqueidentifier] NULL CONSTRAINT [DF_zzzSBShipping_uId]  DEFAULT (newid()),
	[ShipId] [int] IDENTITY(1,1) NOT NULL,
	[SignId] [int] NOT NULL,
	[ShipType] [int] NOT NULL,
	[ShipValue] [int] NOT NULL,
	[CreatedBy] [int] NULL CONSTRAINT [DF_zzzSBShipping_Createdby]  DEFAULT ((0)),
	[CreatedOn] [datetime] NULL CONSTRAINT [DF_zzzSBShipping_CreatedOn]  DEFAULT (getdate()),
	[ModifiedBy] [int] NULL,
	[ModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_zzzSBShipping] PRIMARY KEY CLUSTERED 
(
	[ShipId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UX_zzzSBShipping] UNIQUE NONCLUSTERED 
(
	[ShipId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [FK_zzzSBSign_ShipId] FOREIGN KEY([SignId])
	REFERENCES zzzSBSign ([SignId])
	ON DELETE CASCADE
) ON [PRIMARY]

GO
